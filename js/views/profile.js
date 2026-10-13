import { h, icon, mascot, toast, confirmDialog, POSES } from '../ui.js';
import { actions, getState } from '../store.js';
import { COURSES } from '../../data/courses.js';
import { ACHIEVEMENTS, streakInfo, totalLessonsDone, unlockedAchievements } from '../progress.js';
import { shell } from './shell.js';

function statCard(iconName, tone, value, label) {
  return h('div', { class: 'stat-card' }, icon(iconName, tone), h('div', null, h('div', { class: 'stat-card__value' }, String(value)), h('div', { class: 'stat-card__label' }, label)));
}

export function profileView({ rerender }) {
  const state = getState();
  const streak = streakInfo(state.activity);
  const unlocked = unlockedAchievements(state, COURSES);
  const since = new Date(state.startedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const name = h('input', { class: 'field', id: 'profile-name', type: 'text', maxlength: '24', value: state.profile.name, placeholder: 'Seu nome ou apelido', autocomplete: 'nickname' });

  const avatars = POSES.map((pose) =>
    h(
      'label',
      { class: 'avatar-opt' },
      h('input', { type: 'radio', name: 'avatar', value: pose.id, checked: pose.id === state.profile.avatar }),
      h('span', { class: 'avatar-opt__box' }, mascot(pose.id)),
      h('span', { class: 'sr-only' }, pose.nome),
    ),
  );

  const form = h(
    'form',
    {
      class: 'profile-form',
      onSubmit: (e) => {
        e.preventDefault();
        actions.setProfile({ name: name.value, avatar: new FormData(form).get('avatar') });
        toast('Perfil salvo.');
      },
    },
    h('div', { class: 'form-block' }, h('label', { class: 'label', for: 'profile-name' }, 'Nome'), name),
    h('fieldset', { class: 'form-block', style: { border: 0, padding: 0 } }, h('legend', { class: 'label' }, 'Mascote'), h('div', { class: 'avatars' }, avatars)),
    h('button', { class: 'btn btn--sol', type: 'submit' }, 'Salvar alterações'),
  );

  return shell(
    'perfil',
    h(
      'div',
      { class: 'page' },
      h(
        'header',
        { class: 'profile-head' },
        h('span', { class: 'octo', 'aria-hidden': 'true' }, h('span', { class: 'octo__base' }), h('span', { class: 'octo__face' }, h('span', { class: 'octo__inner' }, mascot(state.profile.avatar)))),
        h('div', null, h('h1', { class: 'profile-head__name', tabindex: '-1', 'data-autofocus': '' }, state.profile.name || 'Estudante'), h('p', { class: 'profile-head__since' }, `Na estrada desde ${since}`)),
      ),
      h(
        'div',
        { class: 'stat-grid' },
        statCard('bolt', 'is-xp', state.xp, 'XP total'),
        statCard('flame', 'is-flame', streak.current, 'Sequência atual'),
        statCard('star', 'is-xp', streak.best, 'Melhor sequência'),
        statCard('check', 'is-heart', totalLessonsDone(state), 'Lições concluídas'),
      ),
      h('h2', { class: 'section-title' }, 'Conquistas'),
      h(
        'ul',
        { class: 'badges' },
        ACHIEVEMENTS.map((a) => {
          const has = unlocked.has(a.id);
          return h(
            'li',
            { class: `badge ${has ? '' : 'is-locked'}` },
            h('span', { class: `octo ${has ? '' : 'octo--muted'}`, 'aria-hidden': 'true' }, h('span', { class: 'octo__base' }), h('span', { class: 'octo__face' }, h('span', { class: 'octo__inner' }, icon(has ? 'star' : 'lock')))),
            h('span', { class: 'badge__title' }, a.title, h('span', { class: 'sr-only' }, has ? ' (conquistada)' : ' (bloqueada)')),
            h('span', { class: 'badge__desc' }, a.desc),
          );
        }),
      ),
      h('h2', { class: 'section-title' }, 'Seu perfil'),
      form,
      h(
        'div',
        { class: 'danger' },
        h('p', { class: 'danger__text' }, 'Apagar o progresso remove XP, sequência e lições concluídas deste aparelho. Não dá para desfazer.'),
        h(
          'button',
          {
            class: 'btn btn--ghost',
            type: 'button',
            onClick: async () => {
              const ok = await confirmDialog({
                title: 'Apagar todo o progresso?',
                body: 'Você volta ao início, sem XP, sequência ou lições concluídas.',
                confirmLabel: 'Apagar progresso',
                cancelLabel: 'Manter meu progresso',
                danger: true,
              });
              if (ok) {
                actions.reset();
                location.hash = '#/';
                rerender();
              }
            },
          },
          'Apagar progresso',
        ),
      ),
    ),
  );
}
