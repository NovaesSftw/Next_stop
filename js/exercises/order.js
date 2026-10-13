import { h } from '../ui.js';
import { answerTokens, shuffle } from '../check.js';

/** Montar a frase tocando nas peças, na ordem certa. */
export function orderExercise(ex, { onChange }) {
  const solution = answerTokens(ex);
  const pieces = [...solution, ...(ex.extra ?? [])].map((text, id) => ({ id, text }));

  // Embaralha, garantindo que a ordem inicial não seja a resposta pronta.
  let bankOrder = shuffle(pieces);
  for (let i = 0; i < 6 && pieces.length > 1 && bankOrder.slice(0, solution.length).map((p) => p.text).join(' ') === solution.join(' '); i++) {
    bankOrder = shuffle(pieces);
  }

  const placed = []; // ids na ordem escolhida
  const slots = h('div', { class: 'slots', 'aria-label': 'Sua resposta' });
  const bankButtons = new Map();

  const bank = h(
    'div',
    { class: 'bank' },
    bankOrder.map((piece) => {
      const btn = h('button', { type: 'button', class: 'opt tile', onClick: () => place(piece.id) }, piece.text);
      bankButtons.set(piece.id, btn);
      return btn;
    }),
  );

  function place(id) {
    placed.push(id);
    bankButtons.get(id).classList.add('is-used');
    drawSlots();
    slots.querySelector(`[data-id="${id}"]`)?.focus();
  }

  function remove(id) {
    placed.splice(placed.indexOf(id), 1);
    bankButtons.get(id).classList.remove('is-used');
    drawSlots();
    bankButtons.get(id).focus();
  }

  function drawSlots() {
    slots.replaceChildren(
      ...placed.map((id) => {
        const text = pieces[id].text;
        return h('button', { type: 'button', class: 'opt tile', 'data-id': id, onClick: () => remove(id) }, text);
      }),
    );
    onChange(placed.length ? placed.map((id) => pieces[id].text) : null);
  }

  const el = h('div', null, h('h2', { class: 'prompt' }, ex.prompt), slots, bank);

  return {
    el,
    reveal(correct) {
      for (const btn of [...slots.children, ...bankButtons.values()]) btn.disabled = true;
      for (const btn of slots.children) btn.classList.add(correct ? 'is-right' : 'is-wrong');
    },
  };
}
