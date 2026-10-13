// Pequenos helpers de interface: criação de elementos, ícones, mascote, avisos e diálogos.

/** Cria um elemento. Ex.: h('button', { class: 'btn', onClick: fn }, 'Texto') */
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'style' && typeof value === 'object') {
      for (const [prop, val] of Object.entries(value)) {
        if (prop.startsWith('--')) el.style.setProperty(prop, val);
        else el.style[prop] = val;
      }
    }
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'disabled' || key === 'value' || key === 'checked') el[key] = value;
    else el.setAttribute(key, value === true ? '' : value);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

const ICONS = {
  check: '<path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>',
  close: '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 10V8a4 4 0 018 0v2" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  heart: '<path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  flame: '<path fill="currentColor" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>',
  bolt: '<path fill="currentColor" d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
  play: '<path fill="currentColor" d="M8 5v14l11-7z"/>',
  road: '<path d="M8 3L4 21M16 3l4 18M12 5v3M12 11v3M12 17v3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  book: '<path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2V4z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M9 8h6M9 12h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  user: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  star: '<path fill="currentColor" d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.1 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"/>',
};

/** Ícone em SVG que herda a cor do texto. */
export function icon(name, className = '') {
  const span = document.createElement('span');
  span.className = `icon ${className}`.trim();
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${ICONS[name]}</svg>`;
  return span;
}

export const POSES = [
  { id: 'olhando', nome: 'Explorador' },
  { id: 'pulando', nome: 'Animado' },
  { id: 'piscando', nome: 'Esperto' },
  { id: 'apontando', nome: 'Focado' },
];

/** Mascote da marca. É decorativo, então não tem texto alternativo. */
export function mascot(pose, className = '') {
  return h('img', { class: `mascot ${className}`.trim(), src: `assets/brand/mascote-${pose}.png`, alt: '', draggable: 'false' });
}

export function bar(pct, label) {
  return h(
    'div',
    { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct, 'aria-label': label },
    h('div', { class: 'bar__fill', style: { width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` } }),
  );
}

/* ---------- avisos ---------- */

let toastTimer;
export function toast(message) {
  const box = document.getElementById('toast');
  if (!box) return;
  box.textContent = message;
  box.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove('is-visible'), 2600);
}

/** Diálogo de confirmação. Devolve uma Promise<boolean>. */
export function confirmDialog({ title, body, confirmLabel, cancelLabel, danger = false }) {
  return new Promise((resolve) => {
    const previous = document.activeElement;
    const close = (answer) => {
      document.removeEventListener('keydown', onKey);
      overlay.remove();
      previous?.focus?.();
      resolve(answer);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close(false);
    };
    const cancel = h('button', { class: 'btn btn--sol btn--block', type: 'button', onClick: () => close(false) }, cancelLabel);
    const confirm = h(
      'button',
      { class: `btn btn--block ${danger ? 'btn--coral' : 'btn--ghost'}`, type: 'button', onClick: () => close(true) },
      confirmLabel,
    );
    const overlay = h(
      'div',
      { class: 'overlay' },
      h(
        'div',
        { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dialog-title' },
        h('h2', { class: 'dialog__title', id: 'dialog-title' }, title),
        h('p', { class: 'dialog__body' }, body),
        h('div', { class: 'dialog__actions' }, cancel, confirm),
      ),
    );
    document.addEventListener('keydown', onKey);
    document.body.append(overlay);
    cancel.focus();
  });
}
