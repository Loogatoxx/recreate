/**
 * JS quiz cards aligned to the Tecnologias da Internet (IPT) course by
 * Hélder Pestana (4.javascript.pdf).
 *
 * Coverage mirrors the PDF chapters: syntax, variables, types, operators,
 * control flow, loops, functions, objects, classes, arrays, strings, BOM,
 * DOM, events.
 */

import type { Card } from '../types';

export const JS_QUIZ_CARDS: Card[] = [
  // ===== Variables: var / let / const =====
  {
    id: 'js-001', kind: 'mcq', topic: 'js.var-let-const', promptKey: 'quiz.cards.js-001.prompt',
    options: [
      { id: 'a', label: 'var' }, { id: 'b', label: 'let' },
      { id: 'c', label: 'const' }, { id: 'd', label: 'static' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-001.explanation',
  },
  {
    id: 'js-002', kind: 'mcq', topic: 'js.var-let-const', promptKey: 'quiz.cards.js-002.prompt',
    options: [
      { id: 'a', label: 'var — scope de fonction' }, { id: 'b', label: 'let — scope de bloc' },
      { id: 'c', label: 'const — scope de bloc, valeur immuable' }, { id: 'd', label: 'Tous identiques', i18nKey: 'quiz.options.js-002.d' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.js-002.explanation',
  },

  // ===== Types =====
  {
    id: 'js-003', kind: 'mcq', topic: 'js.types', promptKey: 'quiz.cards.js-003.prompt',
    options: [
      { id: 'a', label: 'String' }, { id: 'b', label: 'Number' },
      { id: 'c', label: 'Boolean' }, { id: 'd', label: 'Integer' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.js-003.explanation',
  },
  {
    id: 'js-004', kind: 'mcq', topic: 'js.typeof', promptKey: 'quiz.cards.js-004.prompt',
    context: 'typeof []',
    options: [
      { id: 'a', label: '"array"' }, { id: 'b', label: '"object"' },
      { id: 'c', label: '"list"' }, { id: 'd', label: '"undefined"' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-004.explanation',
  },
  {
    id: 'js-005', kind: 'mcq', topic: 'js.typeof', promptKey: 'quiz.cards.js-005.prompt',
    context: 'typeof null',
    options: [
      { id: 'a', label: '"null"' }, { id: 'b', label: '"undefined"' },
      { id: 'c', label: '"object"' }, { id: 'd', label: '"none"' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-005.explanation',
  },

  // ===== Operators =====
  {
    id: 'js-006', kind: 'mcq', topic: 'js.operators-compare', promptKey: 'quiz.cards.js-006.prompt',
    context: '5 == "5"',
    options: [
      { id: 'a', label: 'true' }, { id: 'b', label: 'false' },
      { id: 'c', label: 'TypeError' }, { id: 'd', label: 'NaN' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-006.explanation',
  },
  {
    id: 'js-007', kind: 'mcq', topic: 'js.operators-compare', promptKey: 'quiz.cards.js-007.prompt',
    context: '5 === "5"',
    options: [
      { id: 'a', label: 'true' }, { id: 'b', label: 'false' },
      { id: 'c', label: 'TypeError' }, { id: 'd', label: 'NaN' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-007.explanation',
  },
  {
    id: 'js-008', kind: 'mcq', topic: 'js.operators-logic', promptKey: 'quiz.cards.js-008.prompt',
    context: 'true && false || true',
    options: [
      { id: 'a', label: 'true' }, { id: 'b', label: 'false' },
      { id: 'c', label: 'undefined' }, { id: 'd', label: 'TypeError' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-008.explanation',
  },
  {
    id: 'js-009', kind: 'fill-blank', topic: 'js.operators-assign', promptKey: 'quiz.cards.js-009.prompt',
    answer: ['++', '+=1', '+= 1'], explanationKey: 'quiz.cards.js-009.explanation',
  },

  // ===== Template literals =====
  {
    id: 'js-010', kind: 'mcq', topic: 'js.template-literals', promptKey: 'quiz.cards.js-010.prompt',
    options: [
      { id: 'a', label: '"Bonjour " + nom' }, { id: 'b', label: '\'Bonjour \' + nom' },
      { id: 'c', label: '`Bonjour ${nom}`' }, { id: 'd', label: '"Bonjour $nom"' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-010.explanation',
  },

  // ===== Control flow =====
  {
    id: 'js-011', kind: 'mcq', topic: 'js.ternary', promptKey: 'quiz.cards.js-011.prompt',
    options: [
      { id: 'a', label: 'if (x>0) "ok" else "ko"' },
      { id: 'b', label: 'x > 0 ? "ok" : "ko"' },
      { id: 'c', label: 'x > 0 then "ok" else "ko"' },
      { id: 'd', label: 'x > 0 -> "ok" / "ko"' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-011.explanation',
  },
  {
    id: 'js-012', kind: 'mcq', topic: 'js.switch', promptKey: 'quiz.cards.js-012.prompt',
    options: [
      { id: 'a', label: 'continue;' }, { id: 'b', label: 'return;' },
      { id: 'c', label: 'break;' }, { id: 'd', label: 'end;' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-012.explanation',
  },

  // ===== Loops =====
  {
    id: 'js-013', kind: 'mcq', topic: 'js.for', promptKey: 'quiz.cards.js-013.prompt',
    options: [
      { id: 'a', label: 'for (init; condition; increment)' },
      { id: 'b', label: 'for (init, condition, increment)' },
      { id: 'c', label: 'for init to condition step increment' },
      { id: 'd', label: 'for [init; increment] while condition' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-013.explanation',
  },
  {
    id: 'js-014', kind: 'mcq', topic: 'js.while', promptKey: 'quiz.cards.js-014.prompt',
    options: [
      { id: 'a', label: 'for' }, { id: 'b', label: 'while' },
      { id: 'c', label: 'do...while' }, { id: 'd', label: 'forEach' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-014.explanation',
  },
  {
    id: 'js-015', kind: 'mcq', topic: 'js.for-in', promptKey: 'quiz.cards.js-015.prompt',
    options: [
      { id: 'a', label: 'for...of' }, { id: 'b', label: 'for...in' },
      { id: 'c', label: 'for...each' }, { id: 'd', label: 'foreach' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-015.explanation',
  },
  {
    id: 'js-016', kind: 'mcq', topic: 'js.foreach', promptKey: 'quiz.cards.js-016.prompt',
    context: '[1,2,3].forEach(function(item, index) { /* ... */ });',
    options: [
      { id: 'a', label: 'item, index' }, { id: 'b', label: 'index, item' },
      { id: 'c', label: 'value, key' }, { id: 'd', label: 'item seulement', i18nKey: 'quiz.options.js-016.d' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-016.explanation',
  },

  // ===== Functions =====
  {
    id: 'js-017', kind: 'mcq', topic: 'js.functions', promptKey: 'quiz.cards.js-017.prompt',
    options: [
      { id: 'a', label: 'def somme(a, b)' }, { id: 'b', label: 'function somme(a, b) { }' },
      { id: 'c', label: 'func somme(a, b)' }, { id: 'd', label: 'somme = (a, b) -> { }' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-017.explanation',
  },
  {
    id: 'js-018', kind: 'mcq', topic: 'js.arrow-functions', promptKey: 'quiz.cards.js-018.prompt',
    options: [
      { id: 'a', label: 'const f = x -> x * 2' }, { id: 'b', label: 'const f = (x) => x * 2' },
      { id: 'c', label: 'const f = x => function(x * 2)' }, { id: 'd', label: 'const f = arrow x: x * 2' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-018.explanation',
  },
  {
    id: 'js-019', kind: 'mcq', topic: 'js.native-functions', promptKey: 'quiz.cards.js-019.prompt',
    options: [
      { id: 'a', label: 'parseInt("3.14")' }, { id: 'b', label: 'parseFloat("3.14")' },
      { id: 'c', label: 'Number.toInt("3.14")' }, { id: 'd', label: 'int("3.14")' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-019.explanation',
  },
  {
    id: 'js-020', kind: 'mcq', topic: 'js.native-functions', promptKey: 'quiz.cards.js-020.prompt',
    context: 'isNaN("abc")',
    options: [
      { id: 'a', label: 'true' }, { id: 'b', label: 'false' },
      { id: 'c', label: 'TypeError' }, { id: 'd', label: 'NaN' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-020.explanation',
  },

  // ===== Objects =====
  {
    id: 'js-021', kind: 'mcq', topic: 'js.objects', promptKey: 'quiz.cards.js-021.prompt',
    context: 'const p = { nom: "John" }; // accéder à nom',
    options: [
      { id: 'a', label: 'p.nom' }, { id: 'b', label: 'p["nom"]' },
      { id: 'c', label: 'p->nom' }, { id: 'd', label: 'a et b' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.js-021.explanation',
  },
  {
    id: 'js-022', kind: 'mcq', topic: 'js.objects', promptKey: 'quiz.cards.js-022.prompt',
    options: [
      { id: 'a', label: 'remove p.nom' }, { id: 'b', label: 'p.nom = null' },
      { id: 'c', label: 'delete p.nom' }, { id: 'd', label: 'p.deleteProp("nom")' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-022.explanation',
  },
  {
    id: 'js-023', kind: 'mcq', topic: 'js.destructuring', promptKey: 'quiz.cards.js-023.prompt',
    context: 'const { cidade, rua } = morada;',
    options: [
      { id: 'a', label: 'On crée 2 variables à partir des propriétés de morada', i18nKey: 'quiz.options.js-023.a' },
      { id: 'b', label: 'On copie tout l\'objet morada' },
      { id: 'c', label: 'Erreur de syntaxe' },
      { id: 'd', label: 'On crée 2 fonctions', i18nKey: 'quiz.options.js-023.d' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-023.explanation',
  },
  {
    id: 'js-024', kind: 'mcq', topic: 'js.spread', promptKey: 'quiz.cards.js-024.prompt',
    options: [
      { id: 'a', label: 'const c = { a, b }' }, { id: 'b', label: 'const c = a + b', i18nKey: 'quiz.options.js-023.b' },
      { id: 'c', label: 'const c = { ...a, ...b }' }, { id: 'd', label: 'const c = merge(a, b)' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-024.explanation',
  },
  {
    id: 'js-025', kind: 'mcq', topic: 'js.this', promptKey: 'quiz.cards.js-025.prompt',
    options: [
      { id: 'a', label: 'L\'objet global window' },
      { id: 'b', label: 'L\'objet "parent" qui appelle la méthode' },
      { id: 'c', label: 'Une nouvelle copie de l\'objet' },
      { id: 'd', label: 'null' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-025.explanation',
  },
  {
    id: 'js-026', kind: 'mcq', topic: 'js.classes', promptKey: 'quiz.cards.js-026.prompt',
    options: [
      { id: 'a', label: 'init' }, { id: 'b', label: 'create', i18nKey: 'quiz.options.js-025.b' },
      { id: 'c', label: 'constructor', i18nKey: 'quiz.options.js-025.c' }, { id: 'd', label: 'new' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-026.explanation',
  },
  {
    id: 'js-027', kind: 'mcq', topic: 'js.classes', promptKey: 'quiz.cards.js-027.prompt',
    options: [
      { id: 'a', label: 'class Prof inherits Pessoa' }, { id: 'b', label: 'class Prof extends Pessoa' },
      { id: 'c', label: 'class Prof : Pessoa' }, { id: 'd', label: 'class Prof from Pessoa' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-027.explanation',
  },

  // ===== Arrays =====
  {
    id: 'js-028', kind: 'mcq', topic: 'js.arrays', promptKey: 'quiz.cards.js-028.prompt',
    options: [
      { id: 'a', label: '.size' }, { id: 'b', label: '.length' },
      { id: 'c', label: '.count' }, { id: 'd', label: '.elements' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-028.explanation',
  },
  {
    id: 'js-029', kind: 'mcq', topic: 'js.array-mutators', promptKey: 'quiz.cards.js-029.prompt',
    options: [
      { id: 'a', label: 'add()' }, { id: 'b', label: 'push()' },
      { id: 'c', label: 'append()' }, { id: 'd', label: 'insertLast()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-029.explanation',
  },
  {
    id: 'js-030', kind: 'mcq', topic: 'js.array-mutators', promptKey: 'quiz.cards.js-030.prompt',
    options: [
      { id: 'a', label: 'pop()' }, { id: 'b', label: 'shift()' },
      { id: 'c', label: 'unshift()' }, { id: 'd', label: 'removeFirst()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-030.explanation',
  },
  {
    id: 'js-031', kind: 'mcq', topic: 'js.array-mutators', promptKey: 'quiz.cards.js-031.prompt',
    options: [
      { id: 'a', label: 'pop()' }, { id: 'b', label: 'unshift()' },
      { id: 'c', label: 'push()' }, { id: 'd', label: 'shift()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-031.explanation',
  },
  {
    id: 'js-032', kind: 'mcq', topic: 'js.array-iteration', promptKey: 'quiz.cards.js-032.prompt',
    options: [
      { id: 'a', label: '.filter()' }, { id: 'b', label: '.map()' },
      { id: 'c', label: '.reduce()' }, { id: 'd', label: '.forEach()' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-032.explanation',
  },
  {
    id: 'js-033', kind: 'mcq', topic: 'js.array-iteration', promptKey: 'quiz.cards.js-033.prompt',
    options: [
      { id: 'a', label: '.filter()' }, { id: 'b', label: '.map()' },
      { id: 'c', label: '.reduce()' }, { id: 'd', label: '.transform()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-033.explanation',
  },
  {
    id: 'js-034', kind: 'mcq', topic: 'js.array-iteration', promptKey: 'quiz.cards.js-034.prompt',
    options: [
      { id: 'a', label: '.sum()' }, { id: 'b', label: '.reduce()' },
      { id: 'c', label: '.collapse()' }, { id: 'd', label: '.merge()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-034.explanation',
  },
  {
    id: 'js-035', kind: 'mcq', topic: 'js.array-join-split', promptKey: 'quiz.cards.js-035.prompt',
    context: '"John Doe".split(" ")',
    options: [
      { id: 'a', label: '["John", "Doe"]' }, { id: 'b', label: '"John,Doe"' },
      { id: 'c', label: '["John Doe"]' }, { id: 'd', label: 'TypeError' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-035.explanation',
  },

  // ===== String methods =====
  {
    id: 'js-036', kind: 'mcq', topic: 'js.string-methods', promptKey: 'quiz.cards.js-036.prompt',
    context: '"Ferrari".charAt(0)',
    options: [
      { id: 'a', label: '"F"' }, { id: 'b', label: '"f"' },
      { id: 'c', label: '"Ferrari"' }, { id: 'd', label: 'undefined' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-036.explanation',
  },
  {
    id: 'js-037', kind: 'mcq', topic: 'js.string-methods', promptKey: 'quiz.cards.js-037.prompt',
    options: [
      { id: 'a', label: '.search()' }, { id: 'b', label: '.indexOf()' },
      { id: 'c', label: '.find()' }, { id: 'd', label: '.position()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-037.explanation',
  },
  {
    id: 'js-038', kind: 'mcq', topic: 'js.string-methods', promptKey: 'quiz.cards.js-038.prompt',
    context: '"FeRRaRi".toLowerCase()',
    options: [
      { id: 'a', label: '"ferrari"' }, { id: 'b', label: '"FERRARI"' },
      { id: 'c', label: '"feRRaRi"' }, { id: 'd', label: '"Ferrari"' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-038.explanation',
  },

  // ===== Window / dialogs / timers =====
  {
    id: 'js-039', kind: 'mcq', topic: 'js.window-dialogs', promptKey: 'quiz.cards.js-039.prompt',
    options: [
      { id: 'a', label: 'alert()' }, { id: 'b', label: 'confirm()' },
      { id: 'c', label: 'prompt()' }, { id: 'd', label: 'message()' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.js-039.explanation',
  },
  {
    id: 'js-040', kind: 'mcq', topic: 'js.window-dialogs', promptKey: 'quiz.cards.js-040.prompt',
    options: [
      { id: 'a', label: 'alert' }, { id: 'b', label: 'confirm' },
      { id: 'c', label: 'prompt' }, { id: 'd', label: 'dialog' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-040.explanation',
  },
  {
    id: 'js-041', kind: 'mcq', topic: 'js.timers', promptKey: 'quiz.cards.js-041.prompt',
    options: [
      { id: 'a', label: 'setTimeout(callback, 5000)' },
      { id: 'b', label: 'setInterval(callback, 5000)' },
      { id: 'c', label: 'delay(5000, callback)' },
      { id: 'd', label: 'wait(5000).then(callback)' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-041.explanation',
  },
  {
    id: 'js-042', kind: 'mcq', topic: 'js.timers', promptKey: 'quiz.cards.js-042.prompt',
    options: [
      { id: 'a', label: 'setTimeout' }, { id: 'b', label: 'setInterval' },
      { id: 'c', label: 'repeat' }, { id: 'd', label: 'cron' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-042.explanation',
  },

  // ===== Math =====
  {
    id: 'js-043', kind: 'mcq', topic: 'js.math', promptKey: 'quiz.cards.js-043.prompt',
    options: [
      { id: 'a', label: 'Math.rand()' }, { id: 'b', label: 'Math.random()' },
      { id: 'c', label: 'random.number()' }, { id: 'd', label: 'Math.gen()' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-043.explanation',
  },
  {
    id: 'js-044', kind: 'mcq', topic: 'js.math', promptKey: 'quiz.cards.js-044.prompt',
    context: 'Math.floor(8.78)',
    options: [
      { id: 'a', label: '9' }, { id: 'b', label: '8' },
      { id: 'c', label: '8.78' }, { id: 'd', label: '9.0' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-044.explanation',
  },
  {
    id: 'js-045', kind: 'mcq', topic: 'js.math', promptKey: 'quiz.cards.js-045.prompt',
    context: 'Math.ceil(12.01)',
    options: [
      { id: 'a', label: '12' }, { id: 'b', label: '13' },
      { id: 'c', label: '12.01' }, { id: 'd', label: 'NaN' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-045.explanation',
  },

  // ===== Date =====
  {
    id: 'js-046', kind: 'mcq', topic: 'js.date', promptKey: 'quiz.cards.js-046.prompt',
    options: [
      { id: 'a', label: '0 à 11', i18nKey: 'quiz.options.js-046.a' }, { id: 'b', label: '1 à 12', i18nKey: 'quiz.options.js-046.b' },
      { id: 'c', label: '0 à 12', i18nKey: 'quiz.options.js-046.c' }, { id: 'd', label: '1 à 13', i18nKey: 'quiz.options.js-046.d' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-046.explanation',
  },
  {
    id: 'js-047', kind: 'mcq', topic: 'js.date', promptKey: 'quiz.cards.js-047.prompt',
    options: [
      { id: 'a', label: '0 = dimanche' }, { id: 'b', label: '1 = dimanche' },
      { id: 'c', label: '0 = lundi' }, { id: 'd', label: '1 = lundi' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-047.explanation',
  },

  // ===== DOM selection =====
  {
    id: 'js-048', kind: 'mcq', topic: 'js.dom-selection', promptKey: 'quiz.cards.js-048.prompt',
    options: [
      { id: 'a', label: 'document.getElementById("teste")' },
      { id: 'b', label: 'document.getElement("#teste")' },
      { id: 'c', label: 'document.getId("teste")' },
      { id: 'd', label: 'document.find("teste")' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-048.explanation',
  },
  {
    id: 'js-049', kind: 'mcq', topic: 'js.dom-selection', promptKey: 'quiz.cards.js-049.prompt',
    options: [
      { id: 'a', label: 'querySelector — premier élément ; querySelectorAll — tous (NodeList)' },
      { id: 'b', label: 'querySelector — tous ; querySelectorAll — premier' },
      { id: 'c', label: 'Aucune différence', i18nKey: 'quiz.options.js-049.c' },
      { id: 'd', label: 'querySelectorAll retourne un Array', i18nKey: 'quiz.options.js-049.d' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-049.explanation',
  },
  {
    id: 'js-050', kind: 'mcq', topic: 'js.dom-content', promptKey: 'quiz.cards.js-050.prompt',
    options: [
      { id: 'a', label: 'innerHTML inclut le markup, innerText seulement le texte', i18nKey: 'quiz.options.js-050.a' },
      { id: 'b', label: 'Aucune différence', i18nKey: 'quiz.options.js-050.b' },
      { id: 'c', label: 'innerText inclut le markup', i18nKey: 'quiz.options.js-050.c' },
      { id: 'd', label: 'innerHTML retourne un objet', i18nKey: 'quiz.options.js-050.d' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-050.explanation',
  },
  {
    id: 'js-051', kind: 'mcq', topic: 'js.dom-style', promptKey: 'quiz.cards.js-051.prompt',
    context: 'element.style.???', // demanding camelCase
    options: [
      { id: 'a', label: 'element.style.background-color = "red"' },
      { id: 'b', label: 'element.style.backgroundColor = "red"' },
      { id: 'c', label: 'element.style["background-color"]' },
      { id: 'd', label: 'b et c sont valides' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.js-051.explanation',
  },
  {
    id: 'js-052', kind: 'mcq', topic: 'js.dom-create-remove', promptKey: 'quiz.cards.js-052.prompt',
    options: [
      { id: 'a', label: 'document.newElement("p")' },
      { id: 'b', label: 'document.createElement("p")' },
      { id: 'c', label: 'new Element("p")' },
      { id: 'd', label: 'document.add("p")' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-052.explanation',
  },

  // ===== Events =====
  {
    id: 'js-053', kind: 'mcq', topic: 'js.events-classic', promptKey: 'quiz.cards.js-053.prompt',
    options: [
      { id: 'a', label: 'onhover' }, { id: 'b', label: 'onmouseover' },
      { id: 'c', label: 'onenter' }, { id: 'd', label: 'onmousein' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-053.explanation',
  },
  {
    id: 'js-054', kind: 'mcq', topic: 'js.events-classic', promptKey: 'quiz.cards.js-054.prompt',
    options: [
      { id: 'a', label: 'onsubmit' }, { id: 'b', label: 'onsend' },
      { id: 'c', label: 'onpost' }, { id: 'd', label: 'onformsubmit' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.js-054.explanation',
  },
  {
    id: 'js-055', kind: 'mcq', topic: 'js.events-prevent', promptKey: 'quiz.cards.js-055.prompt',
    options: [
      { id: 'a', label: 'event.stop()' },
      { id: 'b', label: 'event.preventDefault()' },
      { id: 'c', label: 'event.cancel()' },
      { id: 'd', label: 'return null' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-055.explanation',
  },
  {
    id: 'js-056', kind: 'mcq', topic: 'js.events-prevent', promptKey: 'quiz.cards.js-056.prompt',
    options: [
      { id: 'a', label: 'return true' }, { id: 'b', label: 'return false' },
      { id: 'c', label: 'return 0' }, { id: 'd', label: 'return null' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-056.explanation',
  },

  // ===== Cookies =====
  {
    id: 'js-057', kind: 'mcq', topic: 'js.cookies', promptKey: 'quiz.cards.js-057.prompt',
    options: [
      { id: 'a', label: 'window.cookie' }, { id: 'b', label: 'document.cookie' },
      { id: 'c', label: 'navigator.cookie' }, { id: 'd', label: 'localStorage.cookie' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.js-057.explanation',
  },
];

/** Map cards by topic for filtering. */
export function jsCardsByTopic(): Map<string, Card[]> {
  const map = new Map<string, Card[]>();
  for (const c of JS_QUIZ_CARDS) {
    if (!map.has(c.topic)) map.set(c.topic, []);
    map.get(c.topic)!.push(c);
  }
  return map;
}
