/**
 * CSS quiz cards aligned to the Tecnologias da Internet (IPT) course by
 * Hélder Pestana (3.css.pdf).
 *
 * Coverage map (versus the PDF sections):
 *   - "Como aplicar CSS" → css.applying (002, 058-059)
 *   - "Regras / anatomia" → css.rules-anatomy (060-061)
 *   - "Tipos de seletores" (tag/class/id/universal) → css.selectors-basic (008-009, 062)
 *   - "Combinações" (descendant / > / + / ~ / vírgula) → css.combinators (063-066)
 *   - "Atributos" ([attr], =, ~=, ^=, $=) → css.attribute-selectors (067-070)
 *   - "Pseudo" → css.pseudo-classes, css.pseudo-elements (010, 071-074)
 *   - "Especificidade" → css.specificity (011)
 *   - "Box model" (margin/padding/border/auto) → css.box-model, .margin, .padding (006-007, 075-077)
 *   - "display + visibility + opacity" → css.display, .visibility-opacity (022-023, 078)
 *   - "Posicionamento" (static/relative/abs/fixed) + z-index + float → css.positioning, .z-index, .float (016-017, 079-082)
 *   - "Media types & queries + viewport" → css.media-types, .media-queries, .viewport (024, 083-086)
 *   - "Animações" (transition + @keyframes) → css.transitions, .keyframes (025, 087-089)
 *   - "Variáveis" (:root + var()) → css.variables (090)
 *   - "div vs span" → css.div-span (091)
 */

import type { Card } from '../types';

export const CSS_QUIZ_CARDS: Card[] = [
  // ===== Flexbox (kept from initial seed — bonus topic) =====
  {
    id: 'css-001', kind: 'mcq', topic: 'css.flexbox', promptKey: 'quiz.cards.css-001.prompt',
    options: [
      { id: 'a', label: 'display: flex' }, { id: 'b', label: 'display: flexible' },
      { id: 'c', label: 'flex: enable' }, { id: 'd', label: 'layout: flex' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-001.explanation',
  },
  {
    id: 'css-002', kind: 'mcq', topic: 'css.flexbox', promptKey: 'quiz.cards.css-002.prompt',
    options: [
      { id: 'a', label: 'align-content' }, { id: 'b', label: 'align-items' },
      { id: 'c', label: 'justify-content' }, { id: 'd', label: 'place-items' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-002.explanation',
  },
  {
    id: 'css-003', kind: 'mcq', topic: 'css.flexbox', promptKey: 'quiz.cards.css-003.prompt',
    options: [
      { id: 'a', label: 'align-items' }, { id: 'b', label: 'justify-content' },
      { id: 'c', label: 'flex-direction' }, { id: 'd', label: 'flex-wrap' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-003.explanation',
  },
  {
    id: 'css-004', kind: 'fill-blank', topic: 'css.flexbox', promptKey: 'quiz.cards.css-004.prompt',
    answer: ['column', 'col'], explanationKey: 'quiz.cards.css-004.explanation',
  },
  {
    id: 'css-005', kind: 'mcq', topic: 'css.flexbox', promptKey: 'quiz.cards.css-005.prompt',
    options: [
      { id: 'a', label: 'margin' }, { id: 'b', label: 'spacing' },
      { id: 'c', label: 'gap' }, { id: 'd', label: 'padding' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-005.explanation',
  },

  // ===== Box model basics =====
  {
    id: 'css-006', kind: 'mcq', topic: 'css.padding', promptKey: 'quiz.cards.css-006.prompt',
    options: [
      { id: 'a', label: 'margin' }, { id: 'b', label: 'padding' },
      { id: 'c', label: 'border' }, { id: 'd', label: 'spacing' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-006.explanation',
  },
  {
    id: 'css-007', kind: 'mcq', topic: 'css.margin', promptKey: 'quiz.cards.css-007.prompt',
    options: [
      { id: 'a', label: 'padding' }, { id: 'b', label: 'margin' },
      { id: 'c', label: 'gap' }, { id: 'd', label: 'offset' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-007.explanation',
  },

  // ===== Selectors basic =====
  {
    id: 'css-008', kind: 'mcq', topic: 'css.selectors-basic', promptKey: 'quiz.cards.css-008.prompt',
    options: [
      { id: 'a', label: '#card' }, { id: 'b', label: '.card' },
      { id: 'c', label: '*card' }, { id: 'd', label: '@card' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-008.explanation',
  },
  {
    id: 'css-009', kind: 'mcq', topic: 'css.selectors-basic', promptKey: 'quiz.cards.css-009.prompt',
    options: [
      { id: 'a', label: '.menu' }, { id: 'b', label: '#menu' },
      { id: 'c', label: 'menu' }, { id: 'd', label: '@menu' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-009.explanation',
  },
  {
    id: 'css-010', kind: 'mcq', topic: 'css.pseudo-classes', promptKey: 'quiz.cards.css-010.prompt',
    options: [
      { id: 'a', label: 'button.hover' }, { id: 'b', label: 'button::hover' },
      { id: 'c', label: 'button:hover' }, { id: 'd', label: 'button@hover' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-010.explanation',
  },
  {
    id: 'css-011', kind: 'mcq', topic: 'css.specificity', promptKey: 'quiz.cards.css-011.prompt',
    options: [
      { id: 'a', label: 'div { color: red }' }, { id: 'b', label: '.box { color: red }' },
      { id: 'c', label: '#box { color: red }' }, { id: 'd', label: 'div.box { color: red }' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-011.explanation',
  },

  // ===== Units & colors =====
  {
    id: 'css-012', kind: 'mcq', topic: 'css.units', promptKey: 'quiz.cards.css-012.prompt',
    options: [
      { id: 'a', label: 'px' }, { id: 'b', label: 'em' },
      { id: 'c', label: 'rem' }, { id: 'd', label: '%' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-012.explanation',
  },
  {
    id: 'css-013', kind: 'fill-blank', topic: 'css.units', promptKey: 'quiz.cards.css-013.prompt',
    answer: ['vh', 'vw', 'vmin', 'vmax'], explanationKey: 'quiz.cards.css-013.explanation',
  },
  {
    id: 'css-014', kind: 'mcq', topic: 'css.colors', promptKey: 'quiz.cards.css-014.prompt',
    options: [
      { id: 'a', label: 'rgb(255, 0, 0)' }, { id: 'b', label: '#0000ff' },
      { id: 'c', label: '#00ff00' }, { id: 'd', label: 'hsl(120, 100%, 50%)' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-014.explanation',
  },
  {
    id: 'css-015', kind: 'mcq', topic: 'css.colors', promptKey: 'quiz.cards.css-015.prompt',
    options: [
      { id: 'a', label: 'rgba(0, 0, 0, 0.5)' }, { id: 'b', label: 'rgb(0, 0, 0)' },
      { id: 'c', label: 'transparent: 50%' }, { id: 'd', label: 'opacity: rgb(0, 0, 0)' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-015.explanation',
  },

  // ===== Positioning =====
  {
    id: 'css-016', kind: 'mcq', topic: 'css.positioning', promptKey: 'quiz.cards.css-016.prompt',
    options: [
      { id: 'a', label: 'position: fixed' }, { id: 'b', label: 'position: relative' },
      { id: 'c', label: 'position: absolute' }, { id: 'd', label: 'position: static' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-016.explanation',
  },
  {
    id: 'css-017', kind: 'mcq', topic: 'css.positioning', promptKey: 'quiz.cards.css-017.prompt',
    options: [
      { id: 'a', label: 'position: absolute' }, { id: 'b', label: 'position: fixed' },
      { id: 'c', label: 'position: sticky' }, { id: 'd', label: 'position: static' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-017.explanation',
  },

  // ===== Border & shadow =====
  {
    id: 'css-018', kind: 'fill-blank', topic: 'css.border', promptKey: 'quiz.cards.css-018.prompt',
    answer: ['50%', '50 %'], explanationKey: 'quiz.cards.css-018.explanation',
  },
  {
    id: 'css-019', kind: 'mcq', topic: 'css.shadows', promptKey: 'quiz.cards.css-019.prompt',
    options: [
      { id: 'a', label: '0 4px 12px rgba(0,0,0,0.1)' }, { id: 'b', label: 'inset 0 0 0 4px black' },
      { id: 'c', label: '12px 0 0 black' }, { id: 'd', label: '0 0 12px transparent' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-019.explanation',
  },

  // ===== Typography =====
  {
    id: 'css-020', kind: 'mcq', topic: 'css.typography', promptKey: 'quiz.cards.css-020.prompt',
    options: [
      { id: 'a', label: 'font-weight: 400' }, { id: 'b', label: 'font-weight: 700' },
      { id: 'c', label: 'font-weight: bold' }, { id: 'd', label: 'font-weight: 900' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-020.explanation',
  },
  {
    id: 'css-021', kind: 'mcq', topic: 'css.typography', promptKey: 'quiz.cards.css-021.prompt',
    options: [
      { id: 'a', label: 'text-align' }, { id: 'b', label: 'align-text' },
      { id: 'c', label: 'text-position' }, { id: 'd', label: 'justify' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-021.explanation',
  },

  // ===== Display =====
  {
    id: 'css-022', kind: 'mcq', topic: 'css.display', promptKey: 'quiz.cards.css-022.prompt',
    options: [
      { id: 'a', label: 'block' }, { id: 'b', label: 'inline' },
      { id: 'c', label: 'inline-block' }, { id: 'd', label: 'none' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-022.explanation',
  },
  {
    id: 'css-023', kind: 'mcq', topic: 'css.visibility-opacity', promptKey: 'quiz.cards.css-023.prompt',
    options: [
      { id: 'a', label: 'visibility: hidden' }, { id: 'b', label: 'display: none' },
      { id: 'c', label: 'opacity: 0' }, { id: 'd', label: 'hidden: true' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-023.explanation',
  },

  // ===== Media queries & transitions =====
  {
    id: 'css-024', kind: 'mcq', topic: 'css.media-queries', promptKey: 'quiz.cards.css-024.prompt',
    options: [
      { id: 'a', label: '@media (max-width: 768px)' }, { id: 'b', label: '@responsive (mobile)' },
      { id: 'c', label: '@screen mobile' }, { id: 'd', label: '@mobile-only' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-024.explanation',
  },
  {
    id: 'css-025', kind: 'mcq', topic: 'css.transitions', promptKey: 'quiz.cards.css-025.prompt',
    options: [
      { id: 'a', label: 'transition: 1s' }, { id: 'b', label: 'transition: all 1s' },
      { id: 'c', label: 'animate: 1s' }, { id: 'd', label: 'transition-duration: 1' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-025.explanation',
  },

  // ===== NEW — Applying CSS (PDF §"Como aplicar") =====
  {
    id: 'css-058', kind: 'mcq', topic: 'css.applying', promptKey: 'quiz.cards.css-058.prompt',
    options: [
      { id: 'a', label: '<style src="folha.css">' },
      { id: 'b', label: '<link rel="stylesheet" href="folha.css">' },
      { id: 'c', label: '<css href="folha.css">' },
      { id: 'd', label: '<import "folha.css">' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-058.explanation',
  },
  {
    id: 'css-059', kind: 'mcq', topic: 'css.applying', promptKey: 'quiz.cards.css-059.prompt',
    options: [
      { id: 'a', label: 'External (fichier .css séparé)' },
      { id: 'b', label: 'Internal (balise <style> dans <head>)' },
      { id: 'c', label: 'Inline (attribut style="...")' },
      { id: 'd', label: 'CSS-in-JS' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-059.explanation',
  },

  // ===== NEW — Rules anatomy =====
  {
    id: 'css-060', kind: 'mcq', topic: 'css.rules-anatomy', promptKey: 'quiz.cards.css-060.prompt',
    options: [
      { id: 'a', label: 'sélecteur + déclaration' },
      { id: 'b', label: 'tag + style' },
      { id: 'c', label: 'classe + valeur' },
      { id: 'd', label: 'attribut + valeur' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-060.explanation',
  },
  {
    id: 'css-061', kind: 'mcq', topic: 'css.rules-anatomy', promptKey: 'quiz.cards.css-061.prompt',
    options: [
      { id: 'a', label: '// commentaire' },
      { id: 'b', label: '<!-- commentaire -->' },
      { id: 'c', label: '/* commentaire */' },
      { id: 'd', label: '# commentaire' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-061.explanation',
  },

  // ===== NEW — Universal selector =====
  {
    id: 'css-062', kind: 'mcq', topic: 'css.universal', promptKey: 'quiz.cards.css-062.prompt',
    options: [
      { id: 'a', label: '*' }, { id: 'b', label: 'all' },
      { id: 'c', label: 'any' }, { id: 'd', label: 'tag' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-062.explanation',
  },

  // ===== NEW — Combinators (PDF §"Combinações") =====
  {
    id: 'css-063', kind: 'mcq', topic: 'css.combinators', promptKey: 'quiz.cards.css-063.prompt',
    context: 'table td p { font-weight: bold; }',
    options: [
      { id: 'a', label: 'Toutes les table, td et p en bold' },
      { id: 'b', label: 'Tous les p qui sont à l\'intérieur d\'un td, qui est dans une table (n\'importe quel niveau)' },
      { id: 'c', label: 'Seulement les p qui sont enfants directs de td' },
      { id: 'd', label: 'Erreur de syntaxe' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-063.explanation',
  },
  {
    id: 'css-064', kind: 'mcq', topic: 'css.combinators', promptKey: 'quiz.cards.css-064.prompt',
    options: [
      { id: 'a', label: 'p > span' }, { id: 'b', label: 'p span' },
      { id: 'c', label: 'p + span' }, { id: 'd', label: 'p ~ span' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-064.explanation',
  },
  {
    id: 'css-065', kind: 'mcq', topic: 'css.combinators', promptKey: 'quiz.cards.css-065.prompt',
    context: 'h1 + p { color: red; }',
    options: [
      { id: 'a', label: 'Tous les paragraphes' },
      { id: 'b', label: 'Le paragraphe immédiatement après un h1' },
      { id: 'c', label: 'Tous les paragraphes après un h1 (pas forcément adjacent)' },
      { id: 'd', label: 'Le paragraphe parent du h1' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-065.explanation',
  },
  {
    id: 'css-066', kind: 'mcq', topic: 'css.combinators', promptKey: 'quiz.cards.css-066.prompt',
    context: 'h1 ~ p { color: red; }',
    options: [
      { id: 'a', label: 'Le paragraphe immédiatement après h1' },
      { id: 'b', label: 'Tous les paragraphes frères qui suivent un h1' },
      { id: 'c', label: 'Tous les paragraphes' },
      { id: 'd', label: 'Tous les h1 et p' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-066.explanation',
  },

  // ===== NEW — Attribute selectors =====
  {
    id: 'css-067', kind: 'mcq', topic: 'css.attribute-selectors', promptKey: 'quiz.cards.css-067.prompt',
    options: [
      { id: 'a', label: 'input[type=text]' }, { id: 'b', label: 'input{type=text}' },
      { id: 'c', label: 'input(type=text)' }, { id: 'd', label: 'input.type=text' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-067.explanation',
  },
  {
    id: 'css-068', kind: 'mcq', topic: 'css.attribute-selectors', promptKey: 'quiz.cards.css-068.prompt',
    options: [
      { id: 'a', label: 'img[alt^="Figura"]' }, { id: 'b', label: 'img[alt$="Figura"]' },
      { id: 'c', label: 'img[alt~="Figura"]' }, { id: 'd', label: 'img[alt*="Figura"]' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-068.explanation',
  },
  {
    id: 'css-069', kind: 'mcq', topic: 'css.attribute-selectors', promptKey: 'quiz.cards.css-069.prompt',
    options: [
      { id: 'a', label: 'img[alt^=".png"]' }, { id: 'b', label: 'img[alt$=".png"]' },
      { id: 'c', label: 'img[alt~=".png"]' }, { id: 'd', label: 'img[alt=".png"]' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-069.explanation',
  },
  {
    id: 'css-070', kind: 'mcq', topic: 'css.attribute-selectors', promptKey: 'quiz.cards.css-070.prompt',
    options: [
      { id: 'a', label: 'p:not([lang])' }, { id: 'b', label: 'p[!lang]' },
      { id: 'c', label: 'p:without(lang)' }, { id: 'd', label: '!p[lang]' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-070.explanation',
  },

  // ===== NEW — Pseudo-classes & pseudo-elements =====
  {
    id: 'css-071', kind: 'mcq', topic: 'css.pseudo-classes', promptKey: 'quiz.cards.css-071.prompt',
    options: [
      { id: 'a', label: 'p:first-child' }, { id: 'b', label: 'p::first-child' },
      { id: 'c', label: 'p[first]' }, { id: 'd', label: 'p.first' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-071.explanation',
  },
  {
    id: 'css-072', kind: 'mcq', topic: 'css.pseudo-classes', promptKey: 'quiz.cards.css-072.prompt',
    options: [
      { id: 'a', label: 'p:5' }, { id: 'b', label: 'p:nth(5)' },
      { id: 'c', label: 'p:nth-child(5)' }, { id: 'd', label: 'p:fifth' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-072.explanation',
  },
  {
    id: 'css-073', kind: 'mcq', topic: 'css.pseudo-elements', promptKey: 'quiz.cards.css-073.prompt',
    options: [
      { id: 'a', label: 'p:first-letter' }, { id: 'b', label: 'p::first-letter' },
      { id: 'c', label: 'p:first' }, { id: 'd', label: 'p[first-letter]' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-073.explanation',
  },
  {
    id: 'css-074', kind: 'mcq', topic: 'css.pseudo-elements', promptKey: 'quiz.cards.css-074.prompt',
    options: [
      { id: 'a', label: ':' }, { id: 'b', label: '::' },
      { id: 'c', label: '.' }, { id: 'd', label: '#' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-074.explanation',
  },

  // ===== NEW — Box model deep =====
  {
    id: 'css-075', kind: 'mcq', topic: 'css.margin', promptKey: 'quiz.cards.css-075.prompt',
    options: [
      { id: 'a', label: 'margin: center' }, { id: 'b', label: 'margin: 0 auto' },
      { id: 'c', label: 'margin: auto 0' }, { id: 'd', label: 'align: center' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-075.explanation',
  },
  {
    id: 'css-076', kind: 'mcq', topic: 'css.box-model', promptKey: 'quiz.cards.css-076.prompt',
    options: [
      { id: 'a', label: 'max-width' }, { id: 'b', label: 'width-max' },
      { id: 'c', label: 'max(width)' }, { id: 'd', label: 'maximum-width' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-076.explanation',
  },
  {
    id: 'css-077', kind: 'mcq', topic: 'css.border', promptKey: 'quiz.cards.css-077.prompt',
    options: [
      { id: 'a', label: 'border: solid 2px blue' }, { id: 'b', label: 'border: 2px solid blue' },
      { id: 'c', label: 'border: blue 2px solid' }, { id: 'd', label: 'Tous fonctionnent' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.css-077.explanation',
  },

  // ===== NEW — Visibility & opacity =====
  {
    id: 'css-078', kind: 'mcq', topic: 'css.visibility-opacity', promptKey: 'quiz.cards.css-078.prompt',
    options: [
      { id: 'a', label: '0 à 1 (1 = opaque)' }, { id: 'b', label: '0 à 100' },
      { id: 'c', label: '0% à 100%' }, { id: 'd', label: 'true / false' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-078.explanation',
  },

  // ===== NEW — z-index & float =====
  {
    id: 'css-079', kind: 'mcq', topic: 'css.z-index', promptKey: 'quiz.cards.css-079.prompt',
    options: [
      { id: 'a', label: 'L\'élément avec le z-index LE PLUS BAS' },
      { id: 'b', label: 'L\'élément avec le z-index LE PLUS HAUT' },
      { id: 'c', label: 'Le dernier dans l\'ordre HTML' },
      { id: 'd', label: 'Le premier dans l\'ordre HTML' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-079.explanation',
  },
  {
    id: 'css-080', kind: 'mcq', topic: 'css.z-index', promptKey: 'quiz.cards.css-080.prompt',
    options: [
      { id: 'a', label: 'L\'élément doit avoir un parent flex' },
      { id: 'b', label: 'L\'élément doit avoir display: block' },
      { id: 'c', label: 'L\'élément doit avoir position différent de static' },
      { id: 'd', label: 'Aucune condition, z-index fonctionne toujours' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-080.explanation',
  },
  {
    id: 'css-081', kind: 'mcq', topic: 'css.float', promptKey: 'quiz.cards.css-081.prompt',
    options: [
      { id: 'a', label: 'left' }, { id: 'b', label: 'right' },
      { id: 'c', label: 'top' }, { id: 'd', label: 'none' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-081.explanation',
  },
  {
    id: 'css-082', kind: 'mcq', topic: 'css.float', promptKey: 'quiz.cards.css-082.prompt',
    options: [
      { id: 'a', label: 'clear' }, { id: 'b', label: 'reset-float' },
      { id: 'c', label: 'float-stop' }, { id: 'd', label: 'no-wrap' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-082.explanation',
  },

  // ===== NEW — Media types, queries & viewport =====
  {
    id: 'css-083', kind: 'mcq', topic: 'css.media-types', promptKey: 'quiz.cards.css-083.prompt',
    options: [
      { id: 'a', label: 'all' }, { id: 'b', label: 'screen' },
      { id: 'c', label: 'print' }, { id: 'd', label: 'mobile' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.css-083.explanation',
  },
  {
    id: 'css-084', kind: 'mcq', topic: 'css.media-queries', promptKey: 'quiz.cards.css-084.prompt',
    options: [
      { id: 'a', label: 'and' }, { id: 'b', label: 'or' },
      { id: 'c', label: 'not' }, { id: 'd', label: ', (virgule)' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-084.explanation',
  },
  {
    id: 'css-085', kind: 'mcq', topic: 'css.media-queries', promptKey: 'quiz.cards.css-085.prompt',
    options: [
      { id: 'a', label: '@media screen and (orientation: portrait)' },
      { id: 'b', label: '@media (mode: portrait)' },
      { id: 'c', label: '@media portrait' },
      { id: 'd', label: '@orientation portrait' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-085.explanation',
  },
  {
    id: 'css-086', kind: 'mcq', topic: 'css.viewport', promptKey: 'quiz.cards.css-086.prompt',
    options: [
      { id: 'a', label: '<link viewport="width=device-width">' },
      { id: 'b', label: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' },
      { id: 'c', label: 'viewport: 100% in CSS' },
      { id: 'd', label: '<viewport size="full">' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-086.explanation',
  },

  // ===== NEW — Transitions & keyframes =====
  {
    id: 'css-087', kind: 'mcq', topic: 'css.transitions', promptKey: 'quiz.cards.css-087.prompt',
    options: [
      { id: 'a', label: 'transition-speed' }, { id: 'b', label: 'transition-easing' },
      { id: 'c', label: 'transition-timing-function' }, { id: 'd', label: 'transition-curve' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-087.explanation',
  },
  {
    id: 'css-088', kind: 'mcq', topic: 'css.keyframes', promptKey: 'quiz.cards.css-088.prompt',
    options: [
      { id: 'a', label: '@animation' }, { id: 'b', label: '@keyframes' },
      { id: 'c', label: '@frames' }, { id: 'd', label: 'animation { }' },
    ],
    answer: 'b', explanationKey: 'quiz.cards.css-088.explanation',
  },
  {
    id: 'css-089', kind: 'mcq', topic: 'css.keyframes', promptKey: 'quiz.cards.css-089.prompt',
    options: [
      { id: 'a', label: 'from / to' }, { id: 'b', label: '0% / 100%' },
      { id: 'c', label: 'start / end' }, { id: 'd', label: 'a et b sont équivalents' },
    ],
    answer: 'd', explanationKey: 'quiz.cards.css-089.explanation',
  },

  // ===== NEW — CSS variables =====
  {
    id: 'css-090', kind: 'mcq', topic: 'css.variables', promptKey: 'quiz.cards.css-090.prompt',
    context: ':root { --primary: #6366f1; }',
    options: [
      { id: 'a', label: 'color: primary' }, { id: 'b', label: 'color: $primary' },
      { id: 'c', label: 'color: var(--primary)' }, { id: 'd', label: 'color: #primary' },
    ],
    answer: 'c', explanationKey: 'quiz.cards.css-090.explanation',
  },

  // ===== NEW — div vs span semantics =====
  {
    id: 'css-091', kind: 'mcq', topic: 'css.div-span', promptKey: 'quiz.cards.css-091.prompt',
    options: [
      { id: 'a', label: 'span est inline, div est block' },
      { id: 'b', label: 'span peut contenir des div' },
      { id: 'c', label: 'div est inline, span est block' },
      { id: 'd', label: 'Aucune différence' },
    ],
    answer: 'a', explanationKey: 'quiz.cards.css-091.explanation',
  },
];

/** Map cards by topic for filtering. */
export function cardsByTopic(): Map<string, Card[]> {
  const map = new Map<string, Card[]>();
  for (const c of CSS_QUIZ_CARDS) {
    if (!map.has(c.topic)) map.set(c.topic, []);
    map.get(c.topic)!.push(c);
  }
  return map;
}
