import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getLevel } from '@/lib/levels';

const STATIC_HINTS: Record<string, Record<string, string[]>> = {
  fr: {
    '01-center-div': [
      'Pense à `display: flex` sur le conteneur.',
      "Les axes : `justify-content` pour l'horizontal, `align-items` pour le vertical.",
    ],
    '02-card': [
      'Les enfants doivent être en colonne — `flex-direction: column`.',
      "Un avatar rond, c'est un `border-radius: 50%` sur un carré.",
      "N'oublie pas le `box-shadow` pour donner du relief.",
    ],
    '03-button-row': [
      'Les boutons côte à côte = `display: flex`.',
      "Le `gap` gère l'espace entre les enfants flex.",
    ],
    '04-pricing-card': [
      'Empile verticalement avec `flex-direction: column` et `align-items: center`.',
      'Le gros chiffre = `font-size` énorme + `font-weight: 800`.',
      "Le badge `PRO` en haut, c'est `text-transform: uppercase` + `letter-spacing`.",
    ],
  },
  en: {
    '01-center-div': [
      'Think `display: flex` on the container.',
      'Axes: `justify-content` for horizontal, `align-items` for vertical.',
    ],
    '02-card': [
      'Children should stack in a column — `flex-direction: column`.',
      'A round avatar is `border-radius: 50%` on a square.',
      "Don't forget `box-shadow` for depth.",
    ],
    '03-button-row': [
      'Buttons side by side = `display: flex`.',
      '`gap` handles the spacing between flex children.',
    ],
    '04-pricing-card': [
      'Stack vertically with `flex-direction: column` and `align-items: center`.',
      'The huge number = big `font-size` + `font-weight: 800`.',
      'The `PRO` badge uses `text-transform: uppercase` + `letter-spacing`.',
    ],
  },
  pt: {
    '01-center-div': [
      'Pensa em `display: flex` no contentor.',
      'Os eixos: `justify-content` para o horizontal, `align-items` para o vertical.',
    ],
    '02-card': [
      'Os filhos devem ficar em coluna — `flex-direction: column`.',
      'Um avatar redondo é `border-radius: 50%` num quadrado.',
      'Não esqueças o `box-shadow` para dar profundidade.',
    ],
    '03-button-row': [
      'Botões lado a lado = `display: flex`.',
      '`gap` controla o espaço entre os filhos flex.',
    ],
    '04-pricing-card': [
      'Empilha verticalmente com `flex-direction: column` e `align-items: center`.',
      'O número grande = `font-size` enorme + `font-weight: 800`.',
      'O badge `PRO` usa `text-transform: uppercase` + `letter-spacing`.',
    ],
  },
  es: {
    '01-center-div': [
      'Piensa en `display: flex` en el contenedor.',
      'Los ejes: `justify-content` para horizontal, `align-items` para vertical.',
    ],
    '02-card': [
      'Los hijos deben apilarse en columna — `flex-direction: column`.',
      'Un avatar redondo es `border-radius: 50%` sobre un cuadrado.',
      'No olvides el `box-shadow` para dar profundidad.',
    ],
    '03-button-row': [
      'Botones lado a lado = `display: flex`.',
      '`gap` controla el espacio entre los hijos flex.',
    ],
    '04-pricing-card': [
      'Apila verticalmente con `flex-direction: column` y `align-items: center`.',
      'El número grande = `font-size` enorme + `font-weight: 800`.',
      'El badge `PRO` usa `text-transform: uppercase` + `letter-spacing`.',
    ],
  },
};

const GENERIC_FALLBACK: Record<string, string> = {
  fr: 'Inspecte la cible et observe la structure visuelle : flex ou grid ? quelles propriétés sautent aux yeux ?',
  en: 'Inspect the target and observe the visual structure: flex or grid? which properties stand out?',
  pt: 'Inspeciona o alvo e observa a estrutura visual: flex ou grid? que propriedades saltam à vista?',
  es: 'Inspecciona el objetivo y observa la estructura visual: ¿flex o grid? ¿qué propiedades destacan?',
};

const LOCALE_LANGUAGE: Record<string, string> = {
  fr: 'français',
  en: 'English',
  pt: 'português (Portugal)',
  es: 'español',
};

function fallback(levelId: string, locale: string): string {
  const localeHints = STATIC_HINTS[locale] ?? STATIC_HINTS.fr;
  const hints = localeHints[levelId];
  if (hints && hints.length > 0) {
    return hints[Math.floor(Math.random() * hints.length)];
  }
  return GENERIC_FALLBACK[locale] ?? GENERIC_FALLBACK.fr;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    levelId?: string;
    targetHtml?: string;
    targetCss?: string;
    currentHtml?: string;
    currentCss?: string;
    locale?: string;
  };
  const levelId = body.levelId ?? '';
  const locale = body.locale ?? 'fr';

  // Static levels are known server-side; AI levels are stored client-side, so they pass
  // their targetCss directly in the request body.
  const staticLevel = getLevel(levelId);
  const targetCss = staticLevel?.targetCss ?? body.targetCss ?? '';

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !targetCss) {
    return NextResponse.json({ hint: fallback(levelId, locale) });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const language = LOCALE_LANGUAGE[locale] ?? 'français';
    const prompt = `Le joueur essaie de recréer ce composant CSS. Donne-lui UN seul indice court (1 phrase) qui le pousse dans la bonne direction sans donner la solution.

LANGUE DE RÉPONSE : ${language}.

OBJECTIF (CSS cible) :
\`\`\`css
${targetCss}
\`\`\`

CODE ACTUEL DU JOUEUR (CSS) :
\`\`\`css
${body.currentCss ?? ''}
\`\`\`

Règles :
- 1 phrase max, ton sympa.
- Ne donne JAMAIS la valeur exacte (pas de "essaye flex-direction: column"), juste la direction ("regarde du côté de la direction des flex children").
- Si le joueur a déjà bien commencé, encourage et pointe la prochaine étape.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.8 },
    });
    const hint = response.text?.trim();
    if (!hint) return NextResponse.json({ hint: fallback(levelId, locale) });
    return NextResponse.json({ hint });
  } catch {
    return NextResponse.json({ hint: fallback(levelId, locale) });
  }
}
