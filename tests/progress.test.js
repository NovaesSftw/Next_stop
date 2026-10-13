import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HEART_REGEN_MS,
  MAX_HEARTS,
  initialState,
  heartsNow,
  loseHeart,
  xpForLesson,
  applyLessonResult,
  streakInfo,
  weekDays,
  unlockedAchievements,
  courseProgress,
  lessonStatus,
  dateKey,
  addDays,
} from '../js/progress.js';

const at = (iso) => new Date(`${iso}T12:00:00`).getTime();

test('começa com todas as vidas', () => {
  const s = initialState(0);
  assert.equal(heartsNow(s, 0).hearts, MAX_HEARTS);
});

test('perde vida e recupera uma a cada 20 minutos', () => {
  let s = initialState(0);
  s = loseHeart(s, 1000);
  s = loseHeart(s, 2000);
  assert.equal(heartsNow(s, 2000).hearts, 3);
  assert.equal(heartsNow(s, 1000 + HEART_REGEN_MS).hearts, 4);
  assert.equal(heartsNow(s, 1000 + HEART_REGEN_MS * 2).hearts, 5);
  assert.ok(heartsNow(s, 2000).nextIn > 0);
});

test('não perde vida abaixo de zero', () => {
  let s = initialState(0);
  for (let i = 0; i < 8; i++) s = loseHeart(s, 10);
  assert.equal(heartsNow(s, 10).hearts, 0);
});

test('XP: lição perfeita rende bônus', () => {
  assert.equal(xpForLesson({ total: 5, firstTry: 5 }), 25);
  assert.equal(xpForLesson({ total: 5, firstTry: 3 }), 16);
});

test('concluir lição soma XP, registra atividade e progresso', () => {
  const now = at('2026-03-10');
  const { state, xp, perfect } = applyLessonResult(
    initialState(now),
    { courseId: 'a', lessonId: 'a-1', total: 5, firstTry: 5 },
    now,
  );
  assert.equal(xp, 25);
  assert.ok(perfect);
  assert.equal(state.xp, 25);
  assert.equal(state.perfects, 1);
  assert.equal(state.completed.a['a-1'].count, 1);
  assert.equal(state.activity['2026-03-10'].lessons, 1);
});

test('sequência conta dias seguidos e mantém viva até o fim do dia seguinte', () => {
  const activity = {
    '2026-03-08': { xp: 10, lessons: 1 },
    '2026-03-09': { xp: 10, lessons: 1 },
    '2026-03-10': { xp: 10, lessons: 1 },
  };
  assert.deepEqual(streakInfo(activity, at('2026-03-10')), { current: 3, best: 3, activeToday: true });
  // Hoje ainda sem estudar: a sequência de ontem continua valendo
  assert.equal(streakInfo(activity, at('2026-03-11')).current, 3);
  // Passou um dia inteiro sem estudar: zera
  assert.equal(streakInfo(activity, at('2026-03-12')).current, 0);
  assert.equal(streakInfo(activity, at('2026-03-12')).best, 3);
});

test('semana começa na segunda-feira', () => {
  const week = weekDays({ '2026-03-10': { xp: 5, lessons: 1 } }, at('2026-03-11')); // quarta
  assert.equal(week[0].key, '2026-03-09');
  assert.equal(week[1].active, true);
  assert.equal(week[2].today, true);
  assert.equal(week[3].future, true);
});

test('addDays atravessa meses e anos', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(dateKey(new Date(2026, 0, 5)), '2026-01-05');
});

test('trilha libera uma lição por vez', () => {
  const course = { id: 'a', units: [{ lessons: [{ id: 'a-1' }, { id: 'a-2' }, { id: 'a-3' }] }] };
  const now = at('2026-03-10');
  let s = initialState(now);
  assert.deepEqual(lessonStatus(s, course), { 'a-1': 'current', 'a-2': 'locked', 'a-3': 'locked' });
  s = applyLessonResult(s, { courseId: 'a', lessonId: 'a-1', total: 4, firstTry: 3 }, now).state;
  assert.deepEqual(lessonStatus(s, course), { 'a-1': 'done', 'a-2': 'current', 'a-3': 'locked' });
});

test('conquistas e progresso de curso', () => {
  const course = { id: 'a', units: [{ lessons: [{ id: 'a-1' }, { id: 'a-2' }] }] };
  const now = at('2026-03-10');
  let s = initialState(now);
  assert.equal(unlockedAchievements(s, [course], now).size, 0);
  s = applyLessonResult(s, { courseId: 'a', lessonId: 'a-1', total: 4, firstTry: 4 }, now).state;
  s = applyLessonResult(s, { courseId: 'a', lessonId: 'a-2', total: 4, firstTry: 4 }, now).state;
  const got = unlockedAchievements(s, [course], now);
  assert.ok(got.has('primeira-parada'));
  assert.ok(got.has('licao-perfeita'));
  assert.ok(got.has('fim-da-linha'));
  assert.equal(courseProgress(s, course).pct, 100);
});
