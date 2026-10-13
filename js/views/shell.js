import { h, icon } from '../ui.js';
import { getState } from '../store.js';
import { DAILY_GOAL, MAX_HEARTS, dailyXp, formatCountdown, heartsNow, streakInfo, weekDays } from '../progress.js';

const NAV = [
  { id: 'aprender', href: '#/aprender', label: 'Aprender', icon: 'road' },
  { id: 'cursos', href: '#/cursos', label: 'Cursos', icon: 'book' },
  { id: 'perfil', href: '#/perfil', label: 'Perfil', icon: 'user' },
];

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function snapshot(now = Date.now()) {
  const state = getState();
  const hearts = heartsNow(state, now);
  return {
    state,
    hearts: hearts.hearts,
    nextIn: hearts.nextIn,
    streak: streakInfo(state.activity, now),
    xpToday: dailyXp(state.activity, now),
    week: weekDays(state.activity, now),
  };
}

function nav(active) {
  return h(
    'nav',
    { class: 'nav', 'aria-label': 'Principal' },
    h(
      'a',
      { class: 'nav__brand', href: '#/aprender', 'aria-label': 'Next Stop, ir para Aprender' },
      h('img', { src: 'assets/brand/logo.png', alt: '', width: 46, height: 44 }),
      h('span', { class: 'nav__name' }, 'Next Stop'),
    ),
    NAV.map((item) =>
      h(
        'a',
        { class: 'nav__link', href: item.href, 'aria-current': item.id === active ? 'page' : null },
        icon(item.icon),
        h('span', { class: 'nav__label' }, item.label),
      ),
    ),
  );
}

function topbar(snap) {
  return h(
    'div',
    { class: 'topbar' },
    h('span', { class: `pill pill--flame ${snap.streak.current ? '' : 'pill--dim'}`, title: 'Sequência de dias' }, icon('flame'), String(snap.streak.current), h('span', { class: 'sr-only' }, 'dias de sequência')),
    h('span', { class: 'pill pill--xp', title: 'XP total' }, icon('bolt'), String(snap.state.xp), h('span', { class: 'sr-only' }, 'XP')),
    h('span', { class: 'pill pill--heart', title: 'Vidas' }, icon('heart'), String(snap.hearts), h('span', { class: 'sr-only' }, 'vidas')),
  );
}

function ring(pct, label) {
  const C = 2 * Math.PI * 40;
  return h(
    'div',
    { class: 'ring' },
    h(
      'svg',
      { viewBox: '0 0 100 100', 'aria-hidden': 'true' },
      ...svgCircles(C, pct),
    ),
    h('span', { class: 'ring__label' }, label),
  );
}

function svgCircles(C, pct) {
  const ns = 'http://www.w3.org/2000/svg';
  const make = (cls, dash) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('class', cls);
    c.setAttribute('cx', '50');
    c.setAttribute('cy', '50');
    c.setAttribute('r', '40');
    if (dash) c.setAttribute('stroke-dasharray', `${(pct / 100) * C} ${C}`);
    return c;
  };
  return [make('ring__track'), make('ring__value', true)];
}

function rail(snap) {
  const { streak, week, xpToday, hearts, nextIn } = snap;
  const pct = Math.min(100, Math.round((xpToday / DAILY_GOAL) * 100));
  const goalDone = xpToday >= DAILY_GOAL;

  const streakText = streak.current === 0
    ? 'Conclua uma lição para começar a sua sequência.'
    : streak.activeToday
      ? 'Você já estudou hoje. Volte amanhã para continuar.'
      : 'Estude hoje para manter a sua sequência.';

  return h(
    'aside',
    { class: 'rail', 'aria-label': 'Seu progresso' },
    h(
      'section',
      { class: 'card' },
      h('div', { class: `rail__big ${streak.current ? 'is-flame' : ''}` }, icon('flame'), h('span', { style: { color: 'var(--marinho)' } }, plural(streak.current, 'dia', 'dias'))),
      h('p', { class: 'rail__sub' }, streakText),
      h(
        'ol',
        { class: 'week', 'aria-label': 'Dias desta semana' },
        week.map((d) =>
          h(
            'li',
            { class: `week__day ${d.active ? 'is-active' : ''} ${d.today ? 'is-today' : ''}` },
            h('span', { class: 'week__dot' }, d.active ? icon('check') : null),
            h('span', null, d.label),
            h('span', { class: 'sr-only' }, d.active ? 'estudou' : d.future ? 'ainda não chegou' : 'sem estudo'),
          ),
        ),
      ),
    ),
    h(
      'section',
      { class: 'card' },
      h('h2', { class: 'card__title' }, 'Meta de hoje'),
      h(
        'div',
        { class: 'goal' },
        ring(pct, `${pct}%`),
        h('p', null, goalDone ? 'Meta de hoje concluída. Bom trabalho!' : `Faltam ${DAILY_GOAL - xpToday} XP para bater a meta de ${DAILY_GOAL} XP.`),
      ),
    ),
    h(
      'section',
      { class: 'card' },
      h('h2', { class: 'card__title' }, 'Vidas'),
      h(
        'div',
        { class: 'hearts-row', role: 'img', 'aria-label': `${hearts} de ${MAX_HEARTS} vidas` },
        Array.from({ length: MAX_HEARTS }, (_, i) => icon('heart', i < hearts ? '' : 'is-empty')),
      ),
      h(
        'p',
        { class: 'rail__sub' },
        hearts >= MAX_HEARTS ? 'Vidas completas.' : ['Próxima vida em ', h('span', { 'data-heart-timer': '' }, formatCountdown(nextIn)), '.'],
      ),
    ),
  );
}

/** Moldura das telas internas: menu, conteúdo e coluna de metas. */
export function shell(active, content) {
  const snap = snapshot();
  return h('div', { class: 'shell' }, nav(active), h('main', { class: 'shell__main', id: 'main' }, topbar(snap), content), rail(snap));
}
