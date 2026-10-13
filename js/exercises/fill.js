import { h, icon } from '../ui.js';

/** Completar a lacuna escolhendo uma palavra. Atalhos: teclas 1 a 9. */
export function fillExercise(ex, { onChange }) {
  let selected = null;
  const [before, after = ''] = ex.prompt.split('___');
  const blank = h('span', { class: 'blank', 'aria-label': 'lacuna' });

  const chips = ex.options.map((text, i) =>
    h(
      'button',
      { type: 'button', class: 'opt chip', onClick: () => select(i) },
      h('span', { class: 'opt__key' }, String(i + 1)),
      h('span', { class: 'opt__text' }, text),
      h('span', { class: 'opt__mark' }),
    ),
  );

  function select(i) {
    selected = i;
    blank.textContent = ex.options[i];
    chips.forEach((c, j) => c.classList.toggle('is-selected', j === i));
    onChange(i);
  }

  const el = h(
    'div',
    null,
    h('h2', { class: 'prompt' }, 'Complete a frase'),
    h('p', { class: 'sentence' }, before, blank, after),
    h('div', { class: 'chips' }, chips),
  );

  return {
    el,
    onKey(e) {
      const n = Number(e.key);
      if (n >= 1 && n <= chips.length) select(n - 1);
    },
    reveal(correct) {
      blank.classList.add(correct ? 'is-right' : 'is-wrong');
      chips.forEach((c, j) => {
        c.disabled = true;
        c.classList.remove('is-selected');
        const mark = c.querySelector('.opt__mark');
        if (j === ex.answer) {
          c.classList.add('is-right');
          mark.append(icon('check'));
        } else if (j === selected) {
          c.classList.add('is-wrong');
          mark.append(icon('close'));
        }
      });
    },
  };
}
