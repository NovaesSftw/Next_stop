import { h, icon, bar, mascot, toast } from '../ui.js';
import { getState } from '../store.js';
import { COURSES, getCourse } from '../../data/courses.js';
import { courseProgress, lessonStatus } from '../progress.js';
import { shell, plural } from './shell.js';

const ROW = 150; // altura de cada parada na estrada
const TOP = 116; // espaço acima da primeira parada (para o balão "Começar" não encostar no cartão da unidade)
const BOTTOM = 96; // espaço abaixo da última (para o nome da lição)
const WIDTH = 360;

const offsetX = (i) => Math.round(Math.sin(i * 1.15) * 76);

const STATE_LABEL = { done: 'concluída, toque para praticar de novo', current: 'próxima parada', locked: 'bloqueada' };

function stop({ course, lesson, status, x, y }) {
  const locked = status === 'locked';
  const current = status === 'current';
  const glyph = locked ? icon('lock') : status === 'done' ? icon('check') : icon('play');

  const btn = h(
    'button',
    {
      class: `stop stop--${status}`,
      type: 'button',
      style: { left: `${((WIDTH / 2 + x) / WIDTH) * 100}%`, top: `${y}px` },
      'aria-label': `${lesson.title}, ${STATE_LABEL[status]}`,
      'aria-disabled': locked ? 'true' : null,
      onClick: () => {
        if (locked) toast('Conclua a parada anterior para liberar esta.');
        else location.hash = `#/licao/${course.id}/${lesson.id}`;
      },
    },
    current ? h('span', { class: 'stop__pulse', 'aria-hidden': 'true' }) : null,
    h('span', { class: 'stop__base' }),
    h('span', { class: 'stop__face' }, h('span', { class: 'stop__icon' }, glyph)),
    h('span', { class: 'stop__label' }, lesson.title),
    current ? h('span', { class: 'stop__bubble', 'aria-hidden': 'true' }, 'Começar') : null,
    current ? h('span', { class: `stop__mascot stop__mascot--${x >= 0 ? 'left' : 'right'}`, 'aria-hidden': 'true' }, mascot(x >= 0 ? 'piscando' : 'apontando')) : null,
  );
  return btn;
}

function road(points) {
  const ns = 'http://www.w3.org/2000/svg';
  const height = TOP + (points.length - 1) * ROW + BOTTOM;
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'route__svg');
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');

  let d = `M ${points[0].px} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    d += ` C ${a.px} ${a.y + ROW * 0.5}, ${b.px} ${b.y - ROW * 0.5}, ${b.px} ${b.y}`;
  }
  for (const cls of ['road', 'road-line']) {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('class', cls);
    path.setAttribute('d', d);
    svg.append(path);
  }
  return { svg, height };
}

export function learnView() {
  const state = getState();
  const course = getCourse(state.courseId) ?? COURSES[0];
  const status = lessonStatus(state, course);
  const progress = courseProgress(state, course);

  const units = course.units.map((unit, unitIndex) => {
    const points = unit.lessons.map((lesson, i) => ({
      lesson,
      x: offsetX(i),
      px: WIDTH / 2 + offsetX(i),
      y: TOP + i * ROW,
    }));
    const { svg, height } = road(points);
    const route = h(
      'div',
      { class: 'route', style: { height: `${height}px` } },
      svg,
      points.map((p) => stop({ course, lesson: p.lesson, status: status[p.lesson.id], x: p.x, y: p.y })),
    );

    return h(
      'section',
      { class: 'unit', 'aria-labelledby': `unit-${unitIndex}` },
      h('div', { class: 'unit-banner' }, h('span', { class: 'unit-banner__tag' }, `Unidade ${unitIndex + 1}`), h('h2', { class: 'unit-banner__title', id: `unit-${unitIndex}` }, unit.title), h('p', { class: 'unit-banner__sub' }, unit.subtitle)),
      route,
    );
  });

  const finished = progress.pct === 100;

  return shell(
    'aprender',
    h(
      'div',
      { class: 'page' },
      h(
        'header',
        { class: 'card course-head' },
        h(
          'div',
          { class: 'course-head__row' },
          h('div', null, h('h1', { class: 'course-head__title', tabindex: '-1', 'data-autofocus': '' }, course.title), h('p', { class: 'course-head__meta' }, `${progress.done} de ${plural(progress.total, 'parada', 'paradas')}`)),
          h('a', { class: 'btn btn--ghost btn--small', href: '#/cursos' }, 'Trocar de curso'),
        ),
        bar(progress.pct, `Progresso em ${course.title}`),
      ),
      units,
      finished
        ? h(
            'div',
            { class: 'finish' },
            mascot('pulando'),
            h('h2', { class: 'finish__title' }, 'Fim da linha!'),
            h('p', { class: 'finish__text' }, 'Você concluiu todas as paradas deste curso. Toque em qualquer parada para praticar de novo ou escolha outro curso.'),
            h('a', { class: 'btn btn--sol', href: '#/cursos' }, 'Escolher outro curso'),
          )
        : null,
    ),
  );
}
