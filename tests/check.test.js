import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswer, correctText, normalize, shuffle } from '../js/check.js';
import { COURSES } from '../data/courses.js';

test('normalize ignora acento, caixa e pontuação', () => {
  assert.equal(normalize('  Olá,   Mundo! '), 'ola mundo');
});

test('múltipla escolha e lacuna comparam o índice', () => {
  const ex = { type: 'choice', options: ['a', 'b'], answer: 1 };
  assert.equal(checkAnswer(ex, 1), true);
  assert.equal(checkAnswer(ex, 0), false);
  assert.equal(checkAnswer({ ...ex, type: 'fill' }, 1), true);
  assert.equal(correctText(ex), 'b');
});

test('ordenar aceita a frase certa mesmo sem pontuação', () => {
  const ex = { type: 'order', answer: 'I am Ana.', extra: ['you'] };
  assert.equal(checkAnswer(ex, ['I', 'am', 'Ana.']), true);
  assert.equal(checkAnswer(ex, ['am', 'I', 'Ana.']), false);
});

test('resposta digitada aceita variações', () => {
  const ex = { type: 'input', answers: ['thank you', 'thanks'] };
  assert.equal(checkAnswer(ex, 'Thanks!'), true);
  assert.equal(checkAnswer(ex, 'please'), false);
  assert.equal(checkAnswer(ex, undefined), false);
});

test('pares só contam sem erros', () => {
  const ex = { type: 'match', pairs: [['a', 'b']] };
  assert.equal(checkAnswer(ex, { done: true, mistakes: 0 }), true);
  assert.equal(checkAnswer(ex, { done: true, mistakes: 1 }), false);
  assert.equal(checkAnswer(ex, { done: false, mistakes: 0 }), false);
});

test('shuffle mantém os mesmos itens', () => {
  const out = shuffle([1, 2, 3, 4, 5]);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
});

test('conteúdo dos cursos está consistente', () => {
  const ids = new Set();
  for (const course of COURSES) {
    assert.ok(course.units.length > 0, `${course.id} sem unidades`);
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        assert.ok(!ids.has(lesson.id), `id repetido: ${lesson.id}`);
        ids.add(lesson.id);
        assert.ok(lesson.exercises.length >= 4, `${lesson.id} com poucos exercícios`);
        for (const ex of lesson.exercises) {
          assert.ok(ex.prompt, `${lesson.id}: exercício sem enunciado`);
          if (ex.type === 'choice' || ex.type === 'fill') {
            assert.ok(Number.isInteger(ex.answer) && ex.options[ex.answer] !== undefined, `${lesson.id}: resposta inválida`);
            assert.equal(new Set(ex.options).size, ex.options.length, `${lesson.id}: opções repetidas`);
          }
          if (ex.type === 'fill') assert.ok(ex.prompt.includes('___'), `${lesson.id}: lacuna ausente`);
          if (ex.type === 'order') assert.ok(ex.answer.split(' ').length >= 2, `${lesson.id}: frase curta`);
          if (ex.type === 'input') assert.ok(ex.answers.length > 0, `${lesson.id}: sem respostas`);
          if (ex.type === 'match') {
            assert.ok(ex.pairs.length >= 3, `${lesson.id}: poucos pares`);
            const lefts = ex.pairs.map((p) => p[0]);
            const rights = ex.pairs.map((p) => p[1]);
            assert.equal(new Set(lefts).size, lefts.length, `${lesson.id}: lado esquerdo repetido`);
            assert.equal(new Set(rights).size, rights.length, `${lesson.id}: lado direito repetido`);
          }
        }
      }
    }
  }
});
