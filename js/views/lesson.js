import { h, icon, bar, mascot, toast, confirmDialog } from '../ui.js';
import { actions, getState } from '../store.js';
import { findLesson } from '../../data/courses.js';
import { checkAnswer, correctText } from '../check.js';
import { EXERCISE_VIEWS } from '../exercises/index.js';
import { HEART_REGEN_MS, MAX_HEARTS, formatCountdown, heartsNow, lessonStatus } from '../progress.js';

const PRAISE = ['Mandou bem!', 'Isso aí!', 'Perfeito!', 'Na mosca!'];
const pick = (list) => list[Math.floor(Math.random() * list.length)];

/**
 * Tela de lição em tela cheia. Erros voltam ao fim da fila (e custam uma vida);
 * a lição só termina quando todos os exercícios forem acertados.
 */
export function lessonView({ courseId, lessonId }) {
  const found = findLesson(courseId, lessonId);
  const root = h('div', { class: 'lesson' });
  let onKeyDown = null;

  const goHome = () => {
    location.hash = '#/aprender';
  };

  if (!found || lessonStatus(getState(), found.course)[lessonId] === 'locked') {
    queueMicrotask(() => {
      toast('Essa parada ainda não está disponível.');
      goHome();
    });
    return root;
  }

  const { lesson } = found;

  function noHearts() {
    const { nextIn } = heartsNow(getState());
    root.replaceChildren(
      h(
        'div',
        { class: 'result' },
        mascot('olhando'),
        h('h1', { class: 'result__title', tabindex: '-1', 'data-autofocus': '' }, 'Suas vidas acabaram'),
        h('p', { class: 'result__text' }, ['Você ganha uma vida a cada ', Math.round(HEART_REGEN_MS / 60000), ' minutos. A próxima chega em ', h('strong', { 'data-heart-timer': '' }, formatCountdown(nextIn)), '.']),
        h('div', { class: 'result__actions' }, h('button', { class: 'btn btn--sol', type: 'button', onClick: goHome }, 'Voltar para a trilha')),
      ),
    );
    root.querySelector('[data-autofocus]')?.focus();
  }

  function start() {
    if (heartsNow(getState()).hearts <= 0) return noHearts();

    const total = lesson.exercises.length;
    const queue = lesson.exercises.map((ex) => ({ ex, tries: 0 }));
    let correctCount = 0;
    let firstTry = 0;
    let phase = 'answer'; // 'answer' | 'checked'
    let answer = null;
    let wasCorrect = false;
    let item = queue[0];
    let widget = null;
    let feedback = null;

    const progress = bar(0, 'Progresso da lição');
    const hearts = h('span', { class: 'lesson__hearts' });
    const live = h('p', { class: 'sr-only', role: 'status' });
    const body = h('div', { class: 'lesson__body' });
    const foot = h('div', { class: 'lesson__foot' });
    const checkBtn = h('button', { class: 'btn btn--sol', type: 'button', disabled: true, onClick: check }, 'Verificar');
    const nextBtn = h('button', { class: 'btn', type: 'button', onClick: next }, 'Continuar');

    const closeBtn = h(
      'button',
      {
        class: 'iconbtn',
        type: 'button',
        'aria-label': 'Sair da lição',
        onClick: async () => {
          const leave = await confirmDialog({
            title: 'Sair da lição?',
            body: 'Você perde o progresso desta lição.',
            confirmLabel: 'Sair',
            cancelLabel: 'Continuar estudando',
          });
          if (leave) goHome();
        },
      },
      icon('close'),
    );

    function drawHead() {
      const pct = Math.round((correctCount / total) * 100);
      const fill = progress.firstChild;
      fill.style.width = `${Math.max(pct, pct > 0 ? 4 : 0)}%`;
      progress.setAttribute('aria-valuenow', pct);
      const left = heartsNow(getState()).hearts;
      hearts.replaceChildren(icon('heart'), String(left), h('span', { class: 'sr-only' }, ` de ${MAX_HEARTS} vidas`));
    }

    function drawFoot() {
      foot.className = `lesson__foot ${phase === 'checked' ? (wasCorrect ? 'is-correct' : 'is-wrong') : ''}`.trim();
      const inner = h('div', { class: 'lesson__foot-in' });
      if (phase === 'answer') {
        inner.append(h('span'), checkBtn);
      } else {
        nextBtn.className = `btn ${wasCorrect ? 'btn--verde' : 'btn--coral'}`;
        inner.append(feedback, nextBtn);
      }
      foot.replaceChildren(inner);
    }

    function mount() {
      body.replaceChildren();
      answer = null;
      checkBtn.disabled = true;
      widget = EXERCISE_VIEWS[item.ex.type](item.ex, {
        onChange(value) {
          answer = value;
          checkBtn.disabled = value == null;
        },
      });
      body.append(widget.el);
      widget.focus?.();
    }

    function check() {
      if (phase !== 'answer' || answer == null) return;
      wasCorrect = checkAnswer(item.ex, answer);
      widget.reveal(wasCorrect);
      phase = 'checked';

      if (wasCorrect) {
        correctCount++;
        if (item.tries === 0) firstTry++;
        feedback = h('div', { class: 'feedback' }, mascot('piscando'), h('div', null, h('p', { class: 'feedback__title' }, pick(PRAISE)), item.ex.explain ? h('p', { class: 'feedback__text' }, item.ex.explain) : null));
        live.textContent = 'Resposta certa.';
      } else {
        item.tries++;
        actions.loseHeart();
        const right = correctText(item.ex);
        const detail = right ? `Resposta certa: ${right}` : 'Ligue todos os pares sem errar.';
        feedback = h('div', { class: 'feedback' }, mascot('apontando'), h('div', null, h('p', { class: 'feedback__title' }, 'Não foi dessa vez'), h('p', { class: 'feedback__text' }, detail), item.ex.explain ? h('p', { class: 'feedback__text' }, item.ex.explain) : null));
        live.textContent = `Resposta errada. ${detail}`;
      }
      drawHead();
      drawFoot();
      nextBtn.focus();
    }

    function next() {
      if (phase !== 'checked') return;
      queue.shift();
      if (!wasCorrect) queue.push(item);
      if (!wasCorrect && heartsNow(getState()).hearts <= 0) return noHearts();
      if (queue.length === 0) return finish();
      item = queue[0];
      phase = 'answer';
      mount();
      drawFoot();
    }

    function finish() {
      const result = actions.completeLesson({ courseId, lessonId, total, firstTry });
      root.replaceChildren(resultView(result, found, start));
      root.querySelector('[data-autofocus]')?.focus();
    }

    onKeyDown = (e) => {
      if (!root.isConnected || document.querySelector('.overlay')) return;
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
        if (phase === 'answer') check();
        else next();
      } else if (phase === 'answer' && !(e.target instanceof HTMLInputElement)) {
        widget?.onKey?.(e);
      }
    };

    root.replaceChildren(h('header', { class: 'lesson__head' }, closeBtn, progress, hearts), live, body, foot);
    drawHead();
    mount();
    drawFoot();
  }

  document.addEventListener('keydown', (e) => onKeyDown?.(e));
  start();
  return { el: root, cleanup: () => (onKeyDown = null) };
}

function resultView(result, found, restart) {
  const { xp, accuracy, streak, perfect, newAchievements } = result;
  return h(
    'div',
    { class: 'result' },
    mascot('pulando'),
    h('h1', { class: 'result__title', tabindex: '-1', 'data-autofocus': '' }, perfect ? 'Sem nenhum erro!' : 'Parada concluída!'),
    h('p', { class: 'result__text' }, `Você terminou “${found.lesson.title}”.`),
    h(
      'div',
      { class: 'stats' },
      h('div', { class: 'stat' }, h('span', { class: 'stat__value is-xp' }, icon('bolt'), `+${xp}`), h('span', { class: 'stat__label' }, 'XP ganho')),
      h('div', { class: 'stat' }, h('span', { class: 'stat__value' }, `${accuracy}%`), h('span', { class: 'stat__label' }, 'de acerto')),
      h('div', { class: 'stat' }, h('span', { class: 'stat__value is-flame' }, icon('flame'), String(streak)), h('span', { class: 'stat__label' }, streak === 1 ? 'dia seguido' : 'dias seguidos')),
    ),
    newAchievements.length
      ? h(
          'ul',
          { class: 'result__list', 'aria-label': 'Conquistas novas' },
          newAchievements.map((a) => h('li', { class: 'result__item' }, icon('star', 'is-xp'), h('span', null, `Conquista: ${a.title}`))),
        )
      : null,
    h(
      'div',
      { class: 'result__actions' },
      h('a', { class: 'btn btn--sol', href: '#/aprender' }, 'Continuar'),
      h('button', { class: 'btn btn--ghost', type: 'button', onClick: restart }, 'Refazer esta lição'),
    ),
  );
}
