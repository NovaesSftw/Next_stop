// Correção das respostas dos exercícios. Funções puras, sem DOM.

/** Ignora maiúsculas, acentos, pontuação e espaços repetidos. */
export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Peças do exercício "order". Por padrão, cada palavra é uma peça.
 * Se a resposta tiver " | ", as peças são os trechos separados por ele.
 */
export function answerTokens(exercise) {
  return exercise.answer.includes('|')
    ? exercise.answer.split('|').map((t) => t.trim())
    : exercise.answer.split(' ');
}

/**
 * Tipos de exercício:
 *  - choice: { prompt, options, answer: índice }
 *  - fill:   { prompt (com ___), options, answer: índice }
 *  - order:  { prompt, answer: 'frase certa', extra: ['palavras', 'sobrando'] }  → resposta = array de palavras
 *  - input:  { prompt, answers: ['aceita 1', 'aceita 2'] }                       → resposta = texto
 *  - match:  { prompt, pairs: [[a, b], ...] }                                    → resposta = { done, mistakes }
 */
export function checkAnswer(exercise, answer) {
  switch (exercise.type) {
    case 'choice':
    case 'fill':
      return answer === exercise.answer;
    case 'order':
      return Array.isArray(answer) && normalize(answer.join(' ')) === normalize(answerTokens(exercise).join(' '));
    case 'input':
      return typeof answer === 'string' && exercise.answers.some((a) => normalize(a) === normalize(answer));
    case 'match':
      return Boolean(answer && answer.done && answer.mistakes === 0);
    default:
      return false;
  }
}

/** Texto mostrado como "resposta certa" quando o aluno erra. */
export function correctText(exercise) {
  switch (exercise.type) {
    case 'choice':
    case 'fill':
      return exercise.options[exercise.answer];
    case 'order':
      return answerTokens(exercise).join(exercise.answer.includes('|') ? ' → ' : ' ');
    case 'input':
      return exercise.answers[0];
    default:
      return '';
  }
}

/** Embaralha uma cópia do array (Fisher-Yates). `rand` permite testes determinísticos. */
export function shuffle(list, rand = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
