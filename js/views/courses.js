import { h, bar } from '../ui.js';
import { actions, getState } from '../store.js';
import { COURSES } from '../../data/courses.js';
import { courseProgress } from '../progress.js';
import { shell, plural } from './shell.js';

function octo(glyph) {
  return h('span', { class: 'octo', style: { '--size': '64px' }, 'aria-hidden': 'true' }, h('span', { class: 'octo__base' }), h('span', { class: 'octo__face' }, h('span', { class: 'octo__inner' }, glyph)));
}

export function coursesView() {
  const state = getState();

  const cards = COURSES.map((course) => {
    const progress = courseProgress(state, course);
    const current = state.courseId === course.id;
    const label = progress.pct === 100 ? 'Revisar curso' : progress.done > 0 || current ? 'Continuar' : 'Começar curso';

    return h(
      'article',
      { class: `card course-card ${current ? 'is-current' : ''}` },
      octo(course.glyph),
      h(
        'div',
        { class: 'course-card__body' },
        current ? h('span', { class: 'tag' }, 'Curso atual') : null,
        h('h2', { class: 'course-card__title' }, course.title),
        h('p', { class: 'course-card__sub' }, course.subtitle),
        h('p', { class: 'course-card__meta' }, `${course.level}, ${plural(progress.total, 'lição', 'lições')} em ${plural(course.units.length, 'unidade', 'unidades')}`),
      ),
      h(
        'div',
        { class: 'course-card__foot' },
        bar(progress.pct, `Progresso em ${course.title}`),
        h('span', { class: 'course-card__pct' }, `${progress.pct}%`),
        h(
          'button',
          {
            class: `btn btn--small ${current ? 'btn--sol' : 'btn--ghost'}`,
            type: 'button',
            onClick: () => {
              actions.selectCourse(course.id);
              location.hash = '#/aprender';
            },
          },
          label,
          h('span', { class: 'sr-only' }, `: ${course.title}`),
        ),
      ),
    );
  });

  return shell(
    'cursos',
    h(
      'div',
      { class: 'page' },
      h('h1', { class: 'page__title', tabindex: '-1', 'data-autofocus': '' }, 'Cursos'),
      h('p', { class: 'page__lead' }, 'Escolha o que estudar. O seu progresso em cada curso fica guardado.'),
      h('div', { class: 'courses' }, cards),
    ),
  );
}
