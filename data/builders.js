// Atalhos para escrever os cursos sem repetir estrutura.
// Veja o README para adicionar um curso novo.

/** Múltipla escolha. `answer` é o índice da opção certa. */
export const choice = (prompt, options, answer, explain = '') => ({ type: 'choice', prompt, options, answer, explain });

/** Lacuna: o enunciado precisa ter ___ onde a palavra entra. */
export const fill = (prompt, options, answer, explain = '') => ({ type: 'fill', prompt, options, answer, explain });

/**
 * Montar a frase. `answer` é a frase certa; as peças são as palavras.
 * Use " | " na resposta para separar peças maiores. `extra` são peças que sobram.
 */
export const order = (prompt, answer, extra = [], explain = '') => ({ type: 'order', prompt, answer, extra, explain });

/** Resposta digitada. `answers` lista tudo que vale como certo. */
export const input = (prompt, answers, explain = '') => ({ type: 'input', prompt, answers, explain });

/** Ligar pares: [[esquerda, direita], ...]. */
export const match = (prompt, pairs) => ({ type: 'match', prompt, pairs });

export const lesson = (id, title, exercises) => ({ id, title, exercises });

export const unit = (title, subtitle, lessons) => ({ title, subtitle, lessons });
