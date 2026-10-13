import { h, icon } from '../ui.js';

let uid = 0;

/** Múltipla escolha. Atalhos: teclas 1 a 9. */
export function choiceExercise(ex, { onChange }) {
  const id = `q${++uid}`;
  let selected = null;

  const buttons = ex.options.map((text, i) =>
    h(
      'button',
      { type: 'button', class: 'opt', role: 'radio', 'aria-checked': 'false', onClick: () => select(i) },
      h('span', { class: 'opt__key' }, String(i + 1)),
      h('span', { class: 'opt__text' }, text),
      h('span', { class: 'opt__mark' }),
    ),
  );

  function select(i) {
    selected = i;
    buttons.forEach((b, j) => {
      b.classList.toggle('is-selected', j === i);
      b.setAttribute('aria-checked', String(j === i));
    });
    onChange(i);
  }

  const el = h(
    'div',
    null,
    h('h2', { class: 'prompt', id }, ex.prompt),
    h('div', { class: 'opts', role: 'radiogroup', 'aria-labelledby': id }, buttons),
  );

  return {
    el,
    onKey(e) {
      const n = Number(e.key);
      if (n >= 1 && n <= buttons.length) select(n - 1);
    },
    reveal() {
      buttons.forEach((b, j) => {
        b.disabled = true;
        b.classList.remove('is-selected');
        const mark = b.querySelector('.opt__mark');
        if (j === ex.answer) {
          b.classList.add('is-right');
          mark.append(icon('check'));
        } else if (j === selected) {
          b.classList.add('is-wrong');
          mark.append(icon('close'));
        }
      });
    },
  };
}
