import { h } from '../ui.js';

/** Resposta digitada. */
export function inputExercise(ex, { onChange }) {
  const field = h('input', {
    class: 'field answer-input',
    type: 'text',
    placeholder: 'Digite a resposta',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    'aria-label': 'Sua resposta',
  });
  field.addEventListener('input', () => onChange(field.value.trim() || null));

  return {
    el: h('div', null, h('h2', { class: 'prompt' }, ex.prompt), field),
    focus: () => field.focus(),
    reveal(correct) {
      field.readOnly = true;
      field.classList.add(correct ? 'is-right' : 'is-wrong');
    },
  };
}
