// Regras de progresso do Next Stop: XP, vidas, sequência diária, metas e conquistas.
// Tudo aqui é função pura (sem DOM e sem localStorage), para ficar fácil de testar.

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 20 * 60 * 1000; // 1 vida a cada 20 minutos
export const DAILY_GOAL = 30; // XP por dia

const pad = (n) => String(n).padStart(2, '0');

/** Data local no formato AAAA-MM-DD. */
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12); // meio-dia evita problemas de horário de verão
}

export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

export function initialState(now = Date.now()) {
  return {
    v: 1,
    onboarded: false,
    profile: { name: '', avatar: 'olhando' },
    courseId: null,
    xp: 0,
    hearts: MAX_HEARTS,
    heartsAt: now,
    perfects: 0,
    completed: {}, // { [courseId]: { [lessonId]: { count, best } } }
    activity: {}, // { 'AAAA-MM-DD': { xp, lessons } }
    startedAt: now,
  };
}

/* ---------- vidas ---------- */

export function heartsNow(state, now = Date.now()) {
  if (state.hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, nextIn: 0 };
  const elapsed = Math.max(0, now - state.heartsAt);
  const gained = Math.floor(elapsed / HEART_REGEN_MS);
  const hearts = Math.min(MAX_HEARTS, state.hearts + gained);
  if (hearts >= MAX_HEARTS) return { hearts: MAX_HEARTS, nextIn: 0 };
  return { hearts, nextIn: HEART_REGEN_MS - (elapsed - gained * HEART_REGEN_MS) };
}

export function normalizeHearts(state, now = Date.now()) {
  const { hearts } = heartsNow(state, now);
  if (hearts === state.hearts) return state;
  const heartsAt = hearts >= MAX_HEARTS ? now : state.heartsAt + (hearts - state.hearts) * HEART_REGEN_MS;
  return { ...state, hearts, heartsAt };
}

export function loseHeart(state, now = Date.now()) {
  const s = normalizeHearts(state, now);
  if (s.hearts <= 0) return s;
  return { ...s, hearts: s.hearts - 1, heartsAt: s.hearts >= MAX_HEARTS ? now : s.heartsAt };
}

/* ---------- XP e lições ---------- */

export function xpForLesson({ total, firstTry }) {
  return firstTry * 2 + 10 + (firstTry === total ? 5 : 0);
}

export function applyLessonResult(state, { courseId, lessonId, total, firstTry }, now = Date.now()) {
  const xp = xpForLesson({ total, firstTry });
  const perfect = firstTry === total;
  const prev = state.completed[courseId]?.[lessonId] ?? { count: 0, best: 0 };
  const accuracy = Math.round((firstTry / total) * 100);
  const today = dateKey(new Date(now));
  const day = state.activity[today] ?? { xp: 0, lessons: 0 };
  const next = {
    ...state,
    xp: state.xp + xp,
    perfects: state.perfects + (perfect ? 1 : 0),
    completed: {
      ...state.completed,
      [courseId]: {
        ...state.completed[courseId],
        [lessonId]: { count: prev.count + 1, best: Math.max(prev.best, accuracy) },
      },
    },
    activity: { ...state.activity, [today]: { xp: day.xp + xp, lessons: day.lessons + 1 } },
  };
  return { state: next, xp, perfect, accuracy };
}

/* ---------- sequência e metas ---------- */

export function streakInfo(activity, now = Date.now()) {
  const days = Object.keys(activity)
    .filter((k) => activity[k].lessons > 0)
    .sort();
  if (days.length === 0) return { current: 0, best: 0, activeToday: false };

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = addDays(days[i - 1], 1) === days[i] ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const today = dateKey(new Date(now));
  const activeToday = Boolean(activity[today]?.lessons);
  let cursor = activeToday ? today : addDays(today, -1);
  let current = 0;
  while (activity[cursor]?.lessons > 0) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, best: Math.max(best, current), activeToday };
}

export function dailyXp(activity, now = Date.now()) {
  return activity[dateKey(new Date(now))]?.xp ?? 0;
}

const WEEK_LABELS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']; // segunda a domingo

/** Os 7 dias da semana atual (segunda a domingo). */
export function weekDays(activity, now = Date.now()) {
  const today = dateKey(new Date(now));
  const weekday = (new Date(now).getDay() + 6) % 7; // segunda = 0
  const monday = addDays(today, -weekday);
  return WEEK_LABELS.map((label, i) => {
    const key = addDays(monday, i);
    return { key, label, active: Boolean(activity[key]?.lessons), today: key === today, future: key > today };
  });
}

/* ---------- cursos e conquistas ---------- */

export function lessonsOf(course) {
  return course.units.flatMap((u) => u.lessons);
}

/**
 * Situação de cada lição do curso, na ordem da trilha:
 * 'done' (concluída), 'current' (a próxima parada) ou 'locked' (ainda bloqueada).
 */
export function lessonStatus(state, course) {
  const done = state.completed[course.id] ?? {};
  let foundCurrent = false;
  const out = {};
  for (const lesson of lessonsOf(course)) {
    if (done[lesson.id]) out[lesson.id] = 'done';
    else if (!foundCurrent) {
      out[lesson.id] = 'current';
      foundCurrent = true;
    } else out[lesson.id] = 'locked';
  }
  return out;
}

export function courseProgress(state, course) {
  const lessons = lessonsOf(course);
  const done = lessons.filter((l) => state.completed[course.id]?.[l.id]).length;
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
}

export function totalLessonsDone(state) {
  return Object.values(state.completed).reduce((sum, c) => sum + Object.keys(c).length, 0);
}

export const ACHIEVEMENTS = [
  { id: 'primeira-parada', title: 'Primeira parada', desc: 'Conclua a sua primeira lição.', test: (s) => totalLessonsDone(s) >= 1 },
  { id: 'licao-perfeita', title: 'Sem errar', desc: 'Termine uma lição sem nenhum erro.', test: (s) => s.perfects >= 1 },
  { id: 'em-movimento', title: 'Em movimento', desc: 'Estude 3 dias seguidos.', test: (s, c) => streakInfo(s.activity, c.now).best >= 3 },
  { id: 'semana-cheia', title: 'Semana cheia', desc: 'Estude 7 dias seguidos.', test: (s, c) => streakInfo(s.activity, c.now).best >= 7 },
  { id: 'cem-xp', title: '100 de XP', desc: 'Some 100 pontos de experiência.', test: (s) => s.xp >= 100 },
  { id: 'maratona', title: 'Maratona', desc: 'Conclua 5 lições no mesmo dia.', test: (s) => Object.values(s.activity).some((d) => d.lessons >= 5) },
  {
    id: 'dois-destinos',
    title: 'Dois destinos',
    desc: 'Conclua lições em 2 cursos diferentes.',
    test: (s) => Object.values(s.completed).filter((c) => Object.keys(c).length > 0).length >= 2,
  },
  {
    id: 'fim-da-linha',
    title: 'Fim da linha',
    desc: 'Conclua todas as lições de um curso.',
    test: (s, c) => c.courses.some((course) => courseProgress(s, course).pct === 100),
  },
];

/** Ids das conquistas já desbloqueadas. `courses` é a lista de cursos carregada. */
export function unlockedAchievements(state, courses, now = Date.now()) {
  const ctx = { courses, now };
  return new Set(ACHIEVEMENTS.filter((a) => a.test(state, ctx)).map((a) => a.id));
}

/* ---------- formatação ---------- */

export function formatCountdown(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${pad(s)}`;
}
