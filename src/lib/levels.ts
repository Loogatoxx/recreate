import type { TopicId } from './types';

export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'die-and-retry';

export type Category =
  | 'layout'
  | 'card'
  | 'button'
  | 'badge'
  | 'form'
  | 'navigation';

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'layout', label: 'Layout', emoji: '📐' },
  { value: 'card', label: 'Carte', emoji: '🗂️' },
  { value: 'button', label: 'Bouton', emoji: '🔘' },
  { value: 'badge', label: 'Badge', emoji: '🏷️' },
  { value: 'form', label: 'Formulaire', emoji: '📝' },
  { value: 'navigation', label: 'Navigation', emoji: '🧭' },
];

export const DIFFICULTIES: Difficulty[] = [
  'trivial',
  'easy',
  'medium',
  'hard',
  'die-and-retry',
];

export type Level = {
  id: string;
  title: string;
  brief: string;
  difficulty: Difficulty;
  category: Category;
  /** Topic IDs this level exercises — drives mastery tracking. */
  topics: TopicId[];
  starterHtml: string;
  starterCss: string;
  targetHtml: string;
  targetCss: string;
  isBoss?: boolean;
  generated?: boolean;
};

export const LEVELS: Level[] = [
  {
    id: '01-center-div',
    title: 'Centrer une div (lol)',
    brief:
      'Le mythe ultime. Centre le carré violet au milieu de la zone, vertical et horizontal.',
    difficulty: 'trivial',
    category: 'layout',
    topics: ['css.flexbox', 'css.display'],
    starterHtml: `<div class="box">
  <div class="square"></div>
</div>`,
    starterCss: `.box {
  height: 300px;
  background: #f1f5f9;
}

.square {
  width: 80px;
  height: 80px;
  background: #8b5cf6;
  border-radius: 12px;
}`,
    targetHtml: `<div class="box">
  <div class="square"></div>
</div>`,
    targetCss: `.box {
  height: 300px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.square {
  width: 80px;
  height: 80px;
  background: #8b5cf6;
  border-radius: 12px;
}`,
  },

  {
    id: '02-card',
    title: 'La carte de profil',
    brief:
      'Recrée une carte avec avatar rond, nom en gras, et un sous-titre gris.',
    difficulty: 'easy',
    category: 'card',
    topics: ['css.flexbox', 'css.typography', 'css.border', 'css.shadows'],
    starterHtml: `<div class="card">
  <div class="avatar"></div>
  <div class="name">Carlos</div>
  <div class="role">Full-Stack Dev</div>
</div>`,
    starterCss: `.card {

}

.avatar {

}

.name {

}

.role {

}`,
    targetHtml: `<div class="card">
  <div class="avatar"></div>
  <div class="name">Carlos</div>
  <div class="role">Full-Stack Dev</div>
</div>`,
    targetCss: `.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 200px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
}

.name {
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
}

.role {
  color: #64748b;
  font-size: 14px;
}`,
  },

  {
    id: '03-button-row',
    title: 'Trio de boutons',
    brief:
      'Trois boutons côte à côte avec un gap régulier et des couleurs distinctes.',
    difficulty: 'easy',
    category: 'button',
    topics: ['css.flexbox', 'css.colors', 'css.border'],
    starterHtml: `<div class="row">
  <button class="ok">OK</button>
  <button class="cancel">Annuler</button>
  <button class="details">Détails</button>
</div>`,
    starterCss: `.row {

}

button {
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
}

.ok {

}

.cancel {

}

.details {

}`,
    targetHtml: `<div class="row">
  <button class="ok">OK</button>
  <button class="cancel">Annuler</button>
  <button class="details">Détails</button>
</div>`,
    targetCss: `.row {
  display: flex;
  gap: 12px;
  padding: 24px;
}

button {
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 20px;
}

.ok {
  background: #10b981;
}

.cancel {
  background: #ef4444;
}

.details {
  background: #6366f1;
}`,
  },

  {
    id: '04-pricing-card',
    title: 'Carte de pricing',
    brief:
      'Un encart de prix avec titre, gros chiffre, et un bouton "Choisir" en bas.',
    difficulty: 'medium',
    category: 'card',
    topics: ['css.flexbox', 'css.typography', 'css.border', 'css.box-model'],
    starterHtml: `<div class="card">
  <div class="title">Pro</div>
  <div class="price">29€</div>
  <div class="period">/ mois</div>
  <button class="cta">Choisir</button>
</div>`,
    starterCss: `.card {

}

.title {

}

.price {

}

.period {

}

.cta {

}`,
    targetHtml: `<div class="card">
  <div class="title">Pro</div>
  <div class="price">29€</div>
  <div class="period">/ mois</div>
  <button class="cta">Choisir</button>
</div>`,
    targetCss: `.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 32px 40px;
  background: white;
  border: 2px solid #6366f1;
  border-radius: 20px;
  width: 220px;
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.price {
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
}

.period {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
}

.cta {
  background: #6366f1;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 999px;
  font-weight: 600;
  width: 100%;
}`,
  },

  {
    id: '05-notification-badge',
    title: 'Badge de notification',
    brief:
      "Une cloche avec un petit badge rouge en haut à droite qui affiche '3'.",
    difficulty: 'easy',
    category: 'badge',
    topics: ['css.positioning', 'css.border', 'css.flexbox'],
    starterHtml: `<div class="bell">
  <span class="icon">🔔</span>
  <span class="badge">3</span>
</div>`,
    starterCss: `.bell {

}

.icon {

}

.badge {

}`,
    targetHtml: `<div class="bell">
  <span class="icon">🔔</span>
  <span class="badge">3</span>
</div>`,
    targetCss: `.bell {
  position: relative;
  display: inline-block;
  padding: 8px;
}

.icon {
  font-size: 40px;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
  },

  {
    id: '06-search-bar',
    title: 'Barre de recherche',
    brief:
      'Un input avec une icône loupe à gauche, fond gris clair et coins arrondis.',
    difficulty: 'medium',
    category: 'form',
    topics: ['css.flexbox', 'css.border', 'css.backgrounds', 'css.box-model'],
    starterHtml: `<div class="search">
  <span class="icon">🔍</span>
  <input class="input" placeholder="Rechercher..." />
</div>`,
    starterCss: `.search {

}

.icon {

}

.input {

}`,
    targetHtml: `<div class="search">
  <span class="icon">🔍</span>
  <input class="input" placeholder="Rechercher..." />
</div>`,
    targetCss: `.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1f5f9;
  border-radius: 999px;
  width: 280px;
}

.icon {
  font-size: 16px;
  opacity: 0.6;
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #0f172a;
}`,
  },

  {
    id: '07-tab-bar',
    title: 'Barre d\'onglets',
    brief:
      "Trois onglets en ligne, l'onglet 'Accueil' actif (souligné indigo, texte foncé).",
    difficulty: 'medium',
    category: 'navigation',
    topics: ['css.flexbox', 'css.border', 'css.typography', 'css.pseudo-classes'],
    starterHtml: `<div class="tabs">
  <div class="tab active">Accueil</div>
  <div class="tab">Projets</div>
  <div class="tab">Réglages</div>
</div>`,
    starterCss: `.tabs {

}

.tab {

}

.tab.active {

}`,
    targetHtml: `<div class="tabs">
  <div class="tab active">Accueil</div>
  <div class="tab">Projets</div>
  <div class="tab">Réglages</div>
</div>`,
    targetCss: `.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 8px;
}

.tab {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
}

.tab.active {
  color: #6366f1;
  border-bottom: 2px solid #6366f1;
  font-weight: 600;
}`,
  },

  {
    id: '08-stat-card',
    title: 'Carte stat',
    brief:
      "Une carte avec un label discret en haut, une grosse valeur, et un delta '+12 %' en vert.",
    difficulty: 'medium',
    category: 'card',
    topics: ['css.flexbox', 'css.typography', 'css.shadows', 'css.colors'],
    starterHtml: `<div class="stat">
  <div class="label">Revenu mensuel</div>
  <div class="value">12 480 €</div>
  <div class="delta">+12 %</div>
</div>`,
    starterCss: `.stat {

}

.label {

}

.value {

}

.delta {

}`,
    targetHtml: `<div class="stat">
  <div class="label">Revenu mensuel</div>
  <div class="value">12 480 €</div>
  <div class="delta">+12 %</div>
</div>`,
    targetCss: `.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 220px;
}

.label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  font-weight: 600;
}

.value {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}

.delta {
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
}`,
  },

  // ===== Levels aligned to Pestana's CSS course =====

  {
    id: '09-positioned-tag',
    title: 'Tag absolue sur une carte',
    brief: "Une carte avec un tag \"NEW\" rouge ancré en haut à droite via position absolute (PDF §Posicionamento).",
    difficulty: 'medium',
    category: 'card',
    topics: ['css.positioning', 'css.z-index', 'css.border'],
    starterHtml: `<div class="card">
  <span class="tag">NEW</span>
  <h2 class="title">Carte produit</h2>
  <p class="desc">Une superbe description.</p>
</div>`,
    starterCss: `.card {

}

.tag {

}

.title {

}

.desc {

}`,
    targetHtml: `<div class="card">
  <span class="tag">NEW</span>
  <h2 class="title">Carte produit</h2>
  <p class="desc">Une superbe description.</p>
</div>`,
    targetCss: `.card {
  position: relative;
  padding: 32px 24px 24px;
  background: white;
  border-radius: 12px;
  width: 240px;
  border: 1px solid #e2e8f0;
}

.tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
  color: #0f172a;
}

.desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}`,
  },

  {
    id: '10-pseudo-quote',
    title: 'Pseudo-éléments en action',
    brief: "Une citation avec des guillemets ouvrants/fermants via ::before et ::after (PDF §Pseudo-elementos).",
    difficulty: 'medium',
    category: 'card',
    topics: ['css.pseudo-elements', 'css.typography'],
    starterHtml: `<blockquote class="quote">
  La simplicité est la sophistication suprême.
</blockquote>`,
    starterCss: `.quote {

}`,
    targetHtml: `<blockquote class="quote">
  La simplicité est la sophistication suprême.
</blockquote>`,
    targetCss: `.quote {
  font-style: italic;
  font-size: 18px;
  color: #475569;
  padding: 16px 32px;
  position: relative;
}

.quote::before {
  content: "«";
  font-size: 40px;
  color: #6366f1;
  position: absolute;
  left: 4px;
  top: -4px;
}

.quote::after {
  content: "»";
  font-size: 40px;
  color: #6366f1;
}`,
  },

  {
    id: '11-css-variables',
    title: 'Thème via variables CSS',
    brief: "Utilise :root et var() pour une palette réutilisée (PDF §Variáveis).",
    difficulty: 'medium',
    category: 'card',
    topics: ['css.variables', 'css.colors'],
    starterHtml: `<div class="alert">
  <span class="alert-icon">⚠️</span>
  <span class="alert-text">Attention, action requise.</span>
</div>`,
    starterCss: `:root {

}

.alert {

}

.alert-icon {

}

.alert-text {

}`,
    targetHtml: `<div class="alert">
  <span class="alert-icon">⚠️</span>
  <span class="alert-text">Attention, action requise.</span>
</div>`,
    targetCss: `:root {
  --warning-bg: #fef3c7;
  --warning-fg: #92400e;
  --warning-border: #f59e0b;
}

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--warning-bg);
  color: var(--warning-fg);
  border-left: 4px solid var(--warning-border);
  border-radius: 6px;
  width: 320px;
}

.alert-icon {
  font-size: 18px;
}

.alert-text {
  font-size: 14px;
  font-weight: 500;
}`,
  },

  {
    id: '12-keyframes-spinner',
    title: 'Spinner animé (@keyframes)',
    brief: "Un cercle qui tourne en boucle grâce à @keyframes + animation (PDF §Animações por key frame).",
    difficulty: 'hard',
    category: 'layout',
    topics: ['css.keyframes', 'css.transforms', 'css.border'],
    starterHtml: `<div class="spinner"></div>`,
    starterCss: `.spinner {

}`,
    targetHtml: `<div class="spinner"></div>`,
    targetCss: `@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation-name: spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}`,
  },
];

const aiLevels = new Map<string, Level>();

export function registerAiLevel(level: Level) {
  aiLevels.set(level.id, level);
}

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id) ?? aiLevels.get(id);
}
