/**
 * Topic taxonomy aligned to Carlos's Tecnologias da Internet IPT course
 * (CSS: 3.css.pdf · JS: 4.javascript.pdf, both by Hélder Pestana).
 *
 * Important alignment notes:
 *   - The CSS course is HEAVY on selectors (basic + combinations + attributes +
 *     pseudos) and DOES NOT seriously cover flexbox/grid. Topics reflect that.
 *   - The JS course is vanilla ECMAScript + DOM/BOM. Topics cover variables,
 *     control flow, functions, objects, arrays, strings, DOM transversing,
 *     events, etc. — no frameworks.
 */

import type { Topic, TopicId } from './types';

export const CSS_TOPICS: Topic[] = [
  // Fundamentals
  { id: 'css.applying', pillar: 'css', group: 'fundamentals', fallbackLabel: 'External / Internal / Inline' },
  { id: 'css.rules-anatomy', pillar: 'css', group: 'fundamentals', fallbackLabel: 'Anatomie d\'une règle' },

  // Selectors — the bulk of the course
  { id: 'css.selectors-basic', pillar: 'css', group: 'selectors', fallbackLabel: 'Sélecteurs (tag, class, id)' },
  { id: 'css.universal', pillar: 'css', group: 'selectors', fallbackLabel: 'Sélecteur universel (*)' },
  { id: 'css.combinators', pillar: 'css', group: 'selectors', fallbackLabel: 'Combinateurs (descendant, >, +, ~)' },
  { id: 'css.grouping', pillar: 'css', group: 'selectors', fallbackLabel: 'Regroupement (virgule)' },
  { id: 'css.attribute-selectors', pillar: 'css', group: 'selectors', fallbackLabel: 'Sélecteurs d\'attributs' },
  { id: 'css.pseudo-classes', pillar: 'css', group: 'selectors', fallbackLabel: 'Pseudo-classes' },
  { id: 'css.pseudo-elements', pillar: 'css', group: 'selectors', fallbackLabel: 'Pseudo-éléments' },
  { id: 'css.specificity', pillar: 'css', group: 'selectors', fallbackLabel: 'Spécificité' },

  // Box model
  { id: 'css.box-model', pillar: 'css', group: 'box', fallbackLabel: 'Box model (width/height/etc)' },
  { id: 'css.margin', pillar: 'css', group: 'box', fallbackLabel: 'margin (et margin auto)' },
  { id: 'css.padding', pillar: 'css', group: 'box', fallbackLabel: 'padding' },
  { id: 'css.border', pillar: 'css', group: 'box', fallbackLabel: 'border' },
  { id: 'css.display', pillar: 'css', group: 'box', fallbackLabel: 'display' },
  { id: 'css.visibility-opacity', pillar: 'css', group: 'box', fallbackLabel: 'visibility & opacity' },
  { id: 'css.overflow', pillar: 'css', group: 'box', fallbackLabel: 'overflow' },

  // Positioning
  { id: 'css.positioning', pillar: 'css', group: 'layout', fallbackLabel: 'position (static/relative/...)' },
  { id: 'css.z-index', pillar: 'css', group: 'layout', fallbackLabel: 'z-index' },
  { id: 'css.float', pillar: 'css', group: 'layout', fallbackLabel: 'float & clear' },
  { id: 'css.flexbox', pillar: 'css', group: 'layout', fallbackLabel: 'Flexbox (bonus)' },

  // Values
  { id: 'css.units', pillar: 'css', group: 'values', fallbackLabel: 'Unités (px, %, em, rem, vh, vw)' },
  { id: 'css.colors', pillar: 'css', group: 'values', fallbackLabel: 'Couleurs' },
  { id: 'css.variables', pillar: 'css', group: 'values', fallbackLabel: 'Variables CSS (:root + var())' },

  // Styling
  { id: 'css.typography', pillar: 'css', group: 'styling', fallbackLabel: 'Typographie' },
  { id: 'css.backgrounds', pillar: 'css', group: 'styling', fallbackLabel: 'Backgrounds & gradients' },
  { id: 'css.shadows', pillar: 'css', group: 'styling', fallbackLabel: 'Ombres (box-shadow, text-shadow)' },

  // Adaptive
  { id: 'css.media-types', pillar: 'css', group: 'adaptive', fallbackLabel: 'Media types (print/screen/all)' },
  { id: 'css.media-queries', pillar: 'css', group: 'adaptive', fallbackLabel: 'Media queries (@media)' },
  { id: 'css.viewport', pillar: 'css', group: 'adaptive', fallbackLabel: 'Viewport meta' },

  // Motion
  { id: 'css.transitions', pillar: 'css', group: 'motion', fallbackLabel: 'Transitions' },
  { id: 'css.keyframes', pillar: 'css', group: 'motion', fallbackLabel: 'Animations @keyframes' },
  { id: 'css.transforms', pillar: 'css', group: 'motion', fallbackLabel: 'Transforms' },

  // Semantics
  { id: 'css.div-span', pillar: 'css', group: 'semantics', fallbackLabel: 'div vs span' },
];

export const JS_TOPICS: Topic[] = [
  // Basics
  { id: 'js.var-let-const', pillar: 'js', group: 'basics', fallbackLabel: 'var / let / const' },
  { id: 'js.types', pillar: 'js', group: 'basics', fallbackLabel: 'Types (string/number/bool/object/null/undefined)' },
  { id: 'js.typeof', pillar: 'js', group: 'basics', fallbackLabel: 'typeof' },
  { id: 'js.operators-assign', pillar: 'js', group: 'basics', fallbackLabel: 'Opérateurs d\'affectation' },
  { id: 'js.operators-compare', pillar: 'js', group: 'basics', fallbackLabel: 'Opérateurs de comparaison (== vs ===)' },
  { id: 'js.operators-logic', pillar: 'js', group: 'basics', fallbackLabel: 'Opérateurs logiques (&&, ||, !)' },
  { id: 'js.template-literals', pillar: 'js', group: 'basics', fallbackLabel: 'Template literals' },

  // Control flow
  { id: 'js.ternary', pillar: 'js', group: 'control', fallbackLabel: 'Ternaire (?:)' },
  { id: 'js.if-else', pillar: 'js', group: 'control', fallbackLabel: 'if / else if / else' },
  { id: 'js.switch', pillar: 'js', group: 'control', fallbackLabel: 'switch case' },
  { id: 'js.for', pillar: 'js', group: 'control', fallbackLabel: 'for' },
  { id: 'js.while', pillar: 'js', group: 'control', fallbackLabel: 'while / do-while' },
  { id: 'js.for-in', pillar: 'js', group: 'control', fallbackLabel: 'for...in' },
  { id: 'js.foreach', pillar: 'js', group: 'control', fallbackLabel: 'forEach' },

  // Functions
  { id: 'js.functions', pillar: 'js', group: 'functions', fallbackLabel: 'function & return' },
  { id: 'js.arrow-functions', pillar: 'js', group: 'functions', fallbackLabel: 'Arrow functions' },
  { id: 'js.native-functions', pillar: 'js', group: 'functions', fallbackLabel: 'parseInt / parseFloat / isNaN' },

  // Objects & classes
  { id: 'js.objects', pillar: 'js', group: 'oop', fallbackLabel: 'Objets (création, accès, delete)' },
  { id: 'js.destructuring', pillar: 'js', group: 'oop', fallbackLabel: 'Destructuring' },
  { id: 'js.spread', pillar: 'js', group: 'oop', fallbackLabel: 'Spread (...)' },
  { id: 'js.this', pillar: 'js', group: 'oop', fallbackLabel: 'this' },
  { id: 'js.constructors', pillar: 'js', group: 'oop', fallbackLabel: 'Constructeurs' },
  { id: 'js.classes', pillar: 'js', group: 'oop', fallbackLabel: 'class / extends' },

  // Arrays
  { id: 'js.arrays', pillar: 'js', group: 'arrays', fallbackLabel: 'Arrays (création, accès, length)' },
  { id: 'js.array-mutators', pillar: 'js', group: 'arrays', fallbackLabel: 'push / pop / shift / unshift' },
  { id: 'js.array-iteration', pillar: 'js', group: 'arrays', fallbackLabel: 'map / filter / reduce' },
  { id: 'js.array-join-split', pillar: 'js', group: 'arrays', fallbackLabel: 'join / split' },

  // Strings
  { id: 'js.string-methods', pillar: 'js', group: 'strings', fallbackLabel: 'String methods (charAt, indexOf, replace, ...)' },

  // BOM
  { id: 'js.window-dialogs', pillar: 'js', group: 'bom', fallbackLabel: 'alert / prompt / confirm' },
  { id: 'js.timers', pillar: 'js', group: 'bom', fallbackLabel: 'setTimeout / setInterval' },
  { id: 'js.math', pillar: 'js', group: 'bom', fallbackLabel: 'Math (random, round, ceil, floor)' },
  { id: 'js.date', pillar: 'js', group: 'bom', fallbackLabel: 'Date' },
  { id: 'js.location-navigator', pillar: 'js', group: 'bom', fallbackLabel: 'location / navigator' },

  // DOM
  { id: 'js.dom-selection', pillar: 'js', group: 'dom', fallbackLabel: 'getElementById / querySelector(All)' },
  { id: 'js.dom-traversing', pillar: 'js', group: 'dom', fallbackLabel: 'children / parentElement / siblings' },
  { id: 'js.dom-content', pillar: 'js', group: 'dom', fallbackLabel: 'innerHTML / innerText' },
  { id: 'js.dom-attributes', pillar: 'js', group: 'dom', fallbackLabel: 'getAttribute / className / id' },
  { id: 'js.dom-style', pillar: 'js', group: 'dom', fallbackLabel: 'element.style (camelCase)' },
  { id: 'js.dom-create-remove', pillar: 'js', group: 'dom', fallbackLabel: 'createElement / appendChild / remove' },

  // Events
  { id: 'js.events-classic', pillar: 'js', group: 'events', fallbackLabel: 'Événements (onclick, onsubmit, ...)' },
  { id: 'js.events-handlers', pillar: 'js', group: 'events', fallbackLabel: 'Gestionnaires (inline, .onclick)' },
  { id: 'js.events-prevent', pillar: 'js', group: 'events', fallbackLabel: 'preventDefault / return false' },

  // Storage
  { id: 'js.cookies', pillar: 'js', group: 'storage', fallbackLabel: 'document.cookie' },
];

export const ALL_TOPICS: Topic[] = [...CSS_TOPICS, ...JS_TOPICS];

const TOPIC_INDEX = new Map(ALL_TOPICS.map((t) => [t.id, t]));

export function getTopic(id: TopicId): Topic | undefined {
  return TOPIC_INDEX.get(id);
}

export function topicsByPillar(pillar: 'css' | 'js'): Topic[] {
  return ALL_TOPICS.filter((t) => t.pillar === pillar);
}

export function topicsByGroup(pillar: 'css' | 'js'): Map<string, Topic[]> {
  const map = new Map<string, Topic[]>();
  for (const t of topicsByPillar(pillar)) {
    const key = t.group ?? 'misc';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return map;
}
