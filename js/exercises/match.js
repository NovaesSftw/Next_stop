import { h } from '../ui.js';
import { shuffle } from '../check.js';

/** Ligar pares: toque em um item de cada coluna. */
export function matchExercise(ex, { onChange }) {
  const lefts = shuffle(ex.pairs.map((p) => p[0]));
  const rights = shuffle(ex.pairs.map((p) => p[1]));
  const partner = new Map(ex.pairs);
  let selected = null; // { side, text, btn }
  let matched = 0;
  let mistakes = 0;

  const make = (side, text) => {
    const btn = h('button', { type: 'button', class: 'opt pair', onClick: () => pick(side, text, btn) }, text);
    return btn;
  };
  const leftBtns = lefts.map((t) => make('left', t));
  const rightBtns = rights.map((t) => make('right', t));

  function pick(side, text, btn) {
    if (btn.classList.contains('is-matched')) return;
    if (!selected || selected.side === side) {
      selected?.btn.classList.remove('is-selected');
      selected = { side, text, btn };
      btn.classList.add('is-selected');
      return;
    }
    const [leftText, rightText] = side === 'right' ? [selected.text, text] : [text, selected.text];
    const other = selected.btn;
    selected = null;
    other.classList.remove('is-selected');
    if (partner.get(leftText) === rightText) {
      for (const b of [btn, other]) {
        b.classList.add('is-matched');
        b.setAttribute('aria-disabled', 'true');
      }
      matched++;
      if (matched === ex.pairs.length) onChange({ done: true, mistakes });
    } else {
      mistakes++;
      for (const b of [btn, other]) {
        b.classList.add('is-flash');
        setTimeout(() => b.classList.remove('is-flash'), 450);
      }
    }
  }

  const el = h(
    'div',
    null,
    h('h2', { class: 'prompt' }, ex.prompt),
    h('div', { class: 'pairs' }, h('div', { class: 'pairs__col' }, leftBtns), h('div', { class: 'pairs__col' }, rightBtns)),
  );

  return {
    el,
    reveal() {
      for (const b of [...leftBtns, ...rightBtns]) b.disabled = true;
    },
  };
}
