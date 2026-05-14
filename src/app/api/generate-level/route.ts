import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import type { Level } from '@/lib/levels';
import { formatCss, formatHtml } from '@/lib/format-code';

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Titre court et accrocheur du défi' },
    brief: {
      type: Type.STRING,
      description: 'Description du défi en 1-2 phrases, expliquant ce que l\'apprenant doit recréer',
    },
    difficulty: {
      type: Type.STRING,
      enum: ['trivial', 'easy', 'medium', 'hard'],
    },
    category: {
      type: Type.STRING,
      enum: ['layout', 'card', 'button', 'badge', 'form', 'navigation'],
      description:
        'Catégorie du composant : layout (centrage, alignement), card (carte, profil), button (bouton, CTA), badge (badge, notification, status), form (input, recherche), navigation (onglets, breadcrumbs).',
    },
    starterHtml: {
      type: Type.STRING,
      description:
        'HTML de départ : la structure DOM identique à la cible, mais sans aucun style. Doit utiliser des classes nommées sémantiquement.',
    },
    starterCss: {
      type: Type.STRING,
      description:
        'CSS de départ : les sélecteurs vides (juste `.classe { }`) correspondant aux classes du HTML, pour guider l\'apprenant.',
    },
    targetHtml: {
      type: Type.STRING,
      description:
        'HTML final : identique au starterHtml (la structure ne change pas, seul le CSS évolue).',
    },
    targetCss: {
      type: Type.STRING,
      description:
        'CSS complet qui produit le résultat final. Pas de @import, pas de fonts externes, pas de JS. Couleurs hex/rgb, propriétés CSS standard.',
    },
  },
  required: [
    'title',
    'brief',
    'difficulty',
    'category',
    'starterHtml',
    'starterCss',
    'targetHtml',
    'targetCss',
  ],
  propertyOrdering: [
    'title',
    'brief',
    'difficulty',
    'category',
    'starterHtml',
    'starterCss',
    'targetHtml',
    'targetCss',
  ],
};

const REVIEW_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    needsFix: { type: Type.BOOLEAN },
    missingProperties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of (selector, property) pairs, e.g. ".title: font-weight".',
    },
    correctedTargetCss: {
      type: Type.STRING,
      description:
        'Full corrected CSS. Present only when needsFix=true. Must include all original rules plus the additions.',
    },
  },
  required: ['needsFix', 'missingProperties'],
  propertyOrdering: ['needsFix', 'missingProperties', 'correctedTargetCss'],
};

const REVIEW_SYSTEM_PROMPT = `You are a CSS visual-fidelity reviewer.

You receive an HTML snippet and the CSS intended to render its final visual state. Your job: detect CSS declarations that are clearly REQUIRED to produce the visible result but are missing from the CSS.

Common omissions:
- A title that looks bold without \`font-weight: 700\` declared
- A heading larger than default body text without \`font-size\` declared
- A card with a visible shadow but no \`box-shadow\`
- A circular avatar without \`border-radius: 50%\`
- A column-stacked layout without \`flex-direction: column\`
- A coloured background that's missing \`background-color\`
- A non-default text colour without \`color\`
- Padding implied by visible whitespace but undeclared
- A border visible in the design but no \`border\`

Decision:
- If everything visually observable IS already declared → respond with \`needsFix: false\` and \`missingProperties: []\`.
- Otherwise → respond with \`needsFix: true\`, list the missing (selector, property) pairs in \`missingProperties\`, AND return \`correctedTargetCss\` containing the FULL corrected CSS — original rules unchanged plus your additions. Do not delete or rewrite existing declarations. Do not rename selectors.

STRICT RULE: only add properties that, if absent, would clearly break the visual match. Do NOT add cosmetic refinements, micro-tweaks, or stylistic preferences. When in doubt, prefer fewer additions.`;

function reviewUserPrompt(targetHtml: string, targetCss: string): string {
  return [
    'Review this generated CSS for missing visually-required properties.',
    '',
    'HTML:',
    '```html',
    targetHtml,
    '```',
    '',
    'CSS:',
    '```css',
    targetCss,
    '```',
  ].join('\n');
}

const LOCALE_LANGUAGE: Record<string, string> = {
  fr: 'français',
  en: 'English',
  pt: 'português (Portugal)',
  es: 'español',
};

function systemPrompt(locale: string) {
  const language = LOCALE_LANGUAGE[locale] ?? 'français';
  return `Tu génères des défis CSS pour une app de "reverse engineering" visuel.
L'apprenant voit la cible (un composant rendu) et doit recréer le CSS pour matcher.

LANGUE DE SORTIE : le \`title\` et le \`brief\` doivent être écrits en ${language}. Les noms de classes CSS et le code restent en anglais (.card, .avatar, etc.).

Contraintes IMPORTANTES :
- Le composant doit tenir dans une zone de ~400x400px (pas trop grand).
- Utiliser UNIQUEMENT du HTML+CSS standard. Pas de JS, pas de fonts externes, pas d'images externes.
- Couleurs en hex (#RRGGBB) ou rgb(). Pas de variables.
- Utiliser des classes nommées sémantiquement (.card, .avatar, .price, .button, etc.).
- Le starterHtml doit avoir EXACTEMENT la même structure DOM que le targetHtml (mêmes balises, mêmes classes, mêmes textes).
- Le starterCss doit déjà déclarer les sélecteurs CSS vides (\`.classe { }\`) pour guider l'apprenant — mais sans aucune propriété à l'intérieur.
- Pédagogie : un défi enseigne 1-3 concepts CSS (flex, padding, box-shadow, border-radius, etc.). Pas 10 à la fois.
- Le résultat visuel doit être joli et reconnaissable : une carte, un badge, un avatar, un bouton stylé, une notification, un loader, etc.

===== EXIGENCE CRITIQUE : EXPLICITER TOUTES LES PROPRIÉTÉS VISIBLES =====

Le moteur de scoring de l'app compare chaque déclaration CSS du targetCss avec le rendu de l'apprenant. Si tu OUBLIES une propriété qui produit une différence visible (ex : un titre en bold sans \`font-weight: 700;\`), l'apprenant ne pourra jamais matcher le rendu — la barre restera bloquée. C'est INACCEPTABLE.

Avant de soumettre, tu DOIS faire une relecture mentale en passant par cette CHECKLIST sur CHAQUE élément de ta cible :

1. **Texte visible** → declare TOUJOURS :
   - \`font-size\` (sauf si le default 16px est OK et que c'est l'intention)
   - \`font-weight\` (sauf si normal 400 est l'intention — alors NE le déclare PAS)
   - \`color\` (sauf si le héritage est l'intention)
   - \`line-height\` si l'écart entre lignes diffère du default
   - \`text-align\` si le texte n'est pas left

2. **Boîtes (div, section, button, card)** → s'il y a un effet visuel sur la boîte, déclare :
   - \`background\` ou \`background-color\` si pas blanc/transparent
   - \`padding\` si l'élément a un espace intérieur visible
   - \`border\` si l'élément a une bordure
   - \`border-radius\` si les coins ne sont PAS carrés
   - \`box-shadow\` si l'élément a une ombre visible
   - \`width\` / \`height\` si la taille n'est pas dictée par le contenu

3. **Layout (parents)** → si les enfants sont alignés/répartis :
   - \`display: flex\` ou \`display: grid\`
   - \`flex-direction\` (column ou row-reverse si différent du défaut row)
   - \`justify-content\` / \`align-items\` si pas le default
   - \`gap\` si l'espace entre enfants n'est pas 0

4. **Positionnement** → si l'élément est décalé :
   - \`position: relative\` / \`absolute\` / \`fixed\`
   - \`top\` / \`right\` / \`bottom\` / \`left\` quand position ≠ static
   - \`z-index\` si l'empilement compte

5. **Cas particuliers** :
   - Texte en **MAJUSCULES** → \`text-transform: uppercase\`
   - Texte espacé → \`letter-spacing\`
   - Coins arrondis sur un seul angle → \`border-top-left-radius\` etc.

ENSUITE, simule mentalement le rendu de ton targetCss. Pour chaque élément, demande-toi : "si l'apprenant retire CETTE déclaration, le rendu change-t-il visiblement ?" Si oui → la déclaration est OBLIGATOIRE dans le target. Sinon → ne la déclare pas (sois minimaliste).

L'apprenant ne doit JAMAIS être bloqué parce qu'une déclaration que tu as oubliée diffère silencieusement entre son rendu et le tien.`;
}

function userPrompt(difficulty?: string, theme?: string) {
  const parts = ['Génère un nouveau défi CSS.'];
  if (difficulty) parts.push(`Difficulté souhaitée : ${difficulty}.`);
  if (theme) parts.push(`Thème ou inspiration : ${theme}.`);
  parts.push(
    'Sois créatif sur le concept du composant. Mais sur le targetCss, sois RIGOUREUX : passe en revue chaque élément avec la checklist du system prompt, et déclare TOUTES les propriétés qui produisent un effet visuel observable. Pas une de moins.'
  );
  return parts.join(' ');
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY manquante. Ajoute-la dans .env.local et redémarre le serveur.' },
      { status: 500 }
    );
  }

  let body: { difficulty?: string; theme?: string; locale?: string } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine
  }

  const locale = body.locale ?? 'fr';

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt(body.difficulty, body.theme),
      config: {
        systemInstruction: systemPrompt(locale),
        responseMimeType: 'application/json',
        responseSchema: SCHEMA,
        // Lower temperature than before: we want creativity in the *concept*
        // (which theme/component to pick) but rigor in the CSS itself — too
        // much randomness leads to forgotten declarations.
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'Réponse vide de Gemini' }, { status: 502 });
    }

    const parsed = JSON.parse(text) as Omit<Level, 'id' | 'generated'>;

    // Self-review pass: ask Gemini whether any visually-required CSS properties
    // are missing from the generated targetCss. If yes, apply the corrected CSS.
    // Runs at most once. On any error, fall back to the original CSS gracefully.
    let reviewedTargetCss = parsed.targetCss;
    try {
      const reviewResp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: reviewUserPrompt(parsed.targetHtml, parsed.targetCss),
        config: {
          systemInstruction: REVIEW_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: REVIEW_SCHEMA,
          temperature: 0.2,
        },
      });
      const reviewText = reviewResp.text;
      if (reviewText) {
        const review = JSON.parse(reviewText) as {
          needsFix: boolean;
          missingProperties: string[];
          correctedTargetCss?: string;
        };
        if (review.needsFix && review.correctedTargetCss) {
          reviewedTargetCss = review.correctedTargetCss;
          console.info(
            '[generate-level] AI self-review applied fix:',
            review.missingProperties
          );
        }
      }
    } catch (reviewErr) {
      console.warn('[generate-level] self-review failed, using original CSS:', reviewErr);
    }

    const level: Level = {
      id: `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      generated: true,
      ...parsed,
      starterHtml: formatHtml(parsed.starterHtml),
      starterCss: formatCss(parsed.starterCss),
      targetHtml: formatHtml(parsed.targetHtml),
      targetCss: formatCss(reviewedTargetCss),
    };

    return NextResponse.json({ level });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
