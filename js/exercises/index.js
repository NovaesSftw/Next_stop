import { choiceExercise } from './choice.js';
import { fillExercise } from './fill.js';
import { orderExercise } from './order.js';
import { inputExercise } from './input.js';
import { matchExercise } from './match.js';

/** Cada tipo de exercício vira uma função que monta a tela e devolve { el, reveal, onKey?, focus? }. */
export const EXERCISE_VIEWS = {
  choice: choiceExercise,
  fill: fillExercise,
  order: orderExercise,
  input: inputExercise,
  match: matchExercise,
};
