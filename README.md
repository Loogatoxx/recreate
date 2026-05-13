# recreate

Apprends le code en faisant du **reverse engineering** visuel.
Regarde la cible. Recrée-la. La jauge te dit à quel point tu te rapproches.

🇫🇷 Français · 🇬🇧 English · 🇵🇹 Português · 🇪🇸 Español

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19.2
- Tailwind CSS v4
- TypeScript
- next-intl (i18n)
- Monaco Editor (éditeur de code dans le navigateur)
- Framer Motion + canvas-confetti
- Zustand (état de jeu)
- Gemini 2.5 Flash (génération de niveaux par IA + indices)
- `pixelmatch` + `html2canvas-pro` (moteur de diff visuel)

## Démarrer en local

```bash
npm install
cp .env.example .env.local
# Édite .env.local et ajoute ta clé Gemini (https://aistudio.google.com/apikey)
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

| Nom | Description |
|-----|-------------|
| `GEMINI_API_KEY` | Clé API Google AI Studio. Active la génération de niveaux par IA et les indices contextuels. |

Si la clé est absente, l'app fonctionne avec des indices statiques par niveau.

## Comment ça marche

L'écran principal est divisé en trois zones :

1. **Éditeur** (HTML + CSS), avec onglets, vue côte à côte, et autocomplétion Monaco
2. **Live Preview** : le rendu de ton code en temps réel
3. **Target** : le composant à reproduire

Le moteur de comparaison parse le CSS du target et, pour chaque déclaration `(sélecteur, propriété)`, vérifie via `getComputedStyle` si ton rendu produit la même valeur. Le score est calculé relativement au starter (point de départ = 0 %, cible parfaite = 100 %).

Le 100% est verrouillé seulement si **toutes les déclarations matchent** ET que la diff pixel-à-pixel est < 1 %.

## Features

- **Mode HTML/CSS séparés** avec onglets et vue split
- **Diff panel** : liste des déclarations encore manquantes, avec hover qui highlight l'élément concerné
- **Manuel** : référence CSS pédagogique intégrée
- **Ingrédients** : palette de couleurs / tailles / fonts du target, copiables au clic
- **SOS AI** : indice contextuel via Gemini (coûte des points)
- **Génération IA** : Gemini crée un niveau sur mesure (difficulté, thème)
- **Internationalisation** : FR / EN / PT / ES via `next-intl`

## Licence

MIT
