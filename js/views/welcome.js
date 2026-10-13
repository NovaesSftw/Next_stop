import { h, mascot, POSES } from '../ui.js';
import { actions } from '../store.js';
import { COURSES } from '../../data/courses.js';

let step = 1;

function road() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'welcome__road');
  svg.setAttribute('viewBox', '0 0 1200 800');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M-60 720 C 220 720 260 440 560 470 S 920 170 1260 110');
  svg.append(path);
  return svg;
}

function brand(extraClass = '') {
  return h('div', { class: `welcome__brand ${extraClass}`.trim() }, h('img', { src: 'assets/brand/logo.png', alt: '', width: 54, height: 52 }), 'Next Stop');
}

export function welcomeView({ rerender }) {
  if (step === 1) {
    return h(
      'div',
      { class: 'welcome on-dark' },
      road(),
      h(
        'div',
        { class: 'welcome__copy' },
        brand(),
        h('h1', { class: 'welcome__title', tabindex: '-1', 'data-autofocus': '' }, 'Qual é a sua próxima parada?'),
        h('p', { class: 'welcome__text' }, 'Lições curtas para estudar um pouco por dia. Ganhe XP, mantenha a sua sequência e avance parada por parada.'),
        h(
          'button',
          {
            class: 'btn btn--sol',
            type: 'button',
            onClick: () => {
              step = 2;
              rerender();
            },
          },
          'Começar',
        ),
      ),
      h('div', { class: 'welcome__art' }, mascot('olhando')),
    );
  }

  const name = h('input', { class: 'field', id: 'name', type: 'text', maxlength: '24', placeholder: 'Seu nome ou apelido', autocomplete: 'nickname' });

  const avatars = POSES.map((pose, i) =>
    h(
      'label',
      { class: 'avatar-opt' },
      h('input', { type: 'radio', name: 'avatar', value: pose.id, checked: i === 0 }),
      h('span', { class: 'avatar-opt__box' }, mascot(pose.id)),
      h('span', { class: 'sr-only' }, pose.nome),
    ),
  );

  const courses = COURSES.map((course, i) =>
    h(
      'label',
      { class: 'course-opt' },
      h('input', { type: 'radio', name: 'course', value: course.id, checked: i === 0 }),
      h('span', { class: 'octo', style: { '--size': '48px' } }, h('span', { class: 'octo__base' }), h('span', { class: 'octo__face' }, h('span', { class: 'octo__inner' }, course.glyph))),
      h('span', null, h('span', { class: 'course-opt__title' }, course.title), h('br'), h('span', { class: 'course-opt__sub' }, course.subtitle)),
    ),
  );

  const form = h(
    'form',
    {
      class: 'welcome__card',
      onSubmit: (e) => {
        e.preventDefault();
        const data = new FormData(form);
        step = 1;
        actions.finishOnboarding({ name: name.value, avatar: data.get('avatar'), courseId: data.get('course') });
        location.hash = '#/aprender';
      },
    },
    h('h1', { class: 'welcome__card-title', tabindex: '-1', 'data-autofocus': '' }, 'Vamos montar a sua rota'),
    h('div', { class: 'form-block' }, h('label', { class: 'label', for: 'name' }, 'Como devemos te chamar?'), name),
    h('fieldset', { class: 'form-block avatars-block', style: { border: 0, padding: 0, margin: '0 0 24px' } }, h('legend', { class: 'label' }, 'Escolha o seu mascote'), h('div', { class: 'avatars' }, avatars)),
    h('fieldset', { class: 'form-block', style: { border: 0, padding: 0 } }, h('legend', { class: 'label' }, 'O que você quer estudar primeiro?'), h('div', { class: 'choice-list' }, courses)),
    h('button', { class: 'btn btn--sol btn--block', type: 'submit' }, 'Ir para a primeira parada'),
  );

  return h('div', { class: 'welcome on-dark' }, road(), h('div', { class: 'welcome__top' }, brand()), form);
}
