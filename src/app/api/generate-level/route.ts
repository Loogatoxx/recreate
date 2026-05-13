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
- Le résultat visuel doit être joli et reconnaissable : une carte, un badge, un avatar, un bouton stylé, une notification, un loader, etc.`;
}

function userPrompt(difficulty?: string, theme?: string) {
  const parts = ['Génère un nouveau défi CSS.'];
  if (difficulty) parts.push(`Difficulté souhaitée : ${difficulty}.`);
  if (theme) parts.push(`Thème ou inspiration : ${theme}.`);
  parts.push(
    'Sois créatif. Le composant doit être visuellement intéressant et enseigner des concepts utiles.'
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
        temperature: 1.0,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: 'Réponse vide de Gemini' }, { status: 502 });
    }

    const parsed = JSON.parse(text) as Omit<Level, 'id' | 'generated'>;
    const level: Level = {
      id: `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      generated: true,
      ...parsed,
      starterHtml: formatHtml(parsed.starterHtml),
      starterCss: formatCss(parsed.starterCss),
      targetHtml: formatHtml(parsed.targetHtml),
      targetCss: formatCss(parsed.targetCss),
    };

    return NextResponse.json({ level });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
