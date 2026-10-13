// Estado do aluno, salvo no navegador (localStorage). Não há servidor nem conta: o progresso vive neste aparelho.
import { COURSES } from '../data/courses.js';
import {
  ACHIEVEMENTS,
  applyLessonResult,
  heartsNow,
  initialState,
  loseHeart,
  normalizeHearts,
  streakInfo,
  unlockedAchievements,
} from './progress.js';

const KEY = 'nextstop:v1';

function load() {
  const fresh = initialState();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.v === 1) return { ...fresh, ...saved, profile: { ...fresh.profile, ...saved.profile } };
  } catch {
    /* sem armazenamento disponível: começa do zero */
  }
  return fresh;
}

let state = load();
const listeners = new Set();

export const getState = () => state;

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignora: o app continua funcionando sem salvar */
  }
  listeners.forEach((fn) => fn(state));
}

export const actions = {
  finishOnboarding({ name, avatar, courseId }) {
    commit({ ...state, onboarded: true, profile: { name: name.trim(), avatar }, courseId });
  },

  selectCourse(courseId) {
    commit({ ...state, courseId });
  },

  setProfile({ name, avatar }) {
    commit({ ...state, profile: { name: name.trim(), avatar } });
  },

  /** Tira uma vida e devolve quantas restam. */
  loseHeart(now = Date.now()) {
    commit(loseHeart(state, now));
    return heartsNow(state, now).hearts;
  },

  /** Registra a lição concluída e devolve o resumo para a tela final. */
  completeLesson(payload, now = Date.now()) {
    const before = unlockedAchievements(state, COURSES, now);
    const result = applyLessonResult(normalizeHearts(state, now), payload, now);
    const after = unlockedAchievements(result.state, COURSES, now);
    commit(result.state);
    return {
      xp: result.xp,
      perfect: result.perfect,
      accuracy: result.accuracy,
      streak: streakInfo(result.state.activity, now).current,
      newAchievements: ACHIEVEMENTS.filter((a) => after.has(a.id) && !before.has(a.id)),
    };
  },

  reset() {
    commit(initialState());
  },
};
