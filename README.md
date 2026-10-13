# Next Stop

Plataforma de cursos em lições curtas, no estilo Duolingo. Cada curso é uma rota, e cada lição é uma parada. O aluno ganha XP, mantém uma sequência diária, perde vidas ao errar e desbloqueia conquistas.

A identidade visual usa o amarelo-sol, o azul-marinho e o branco do mascote octógono.

## Como rodar

O projeto é HTML, CSS e JavaScript puros, sem etapa de build. Basta servir a pasta:

```bash
npm run dev
```

Depois abra http://localhost:5173. Também funciona em qualquer hospedagem estática, como o GitHub Pages.

Para rodar os testes (Node 20 ou mais novo):

```bash
npm test
```

## O que já funciona

- Boas-vindas com nome, mascote e curso inicial
- Trilha de lições por unidade, com uma lição liberada por vez
- Cinco tipos de exercício: múltipla escolha, completar a frase, montar a frase, digitar a resposta e ligar pares
- Vidas (5, com uma nova a cada 20 minutos), XP, meta diária e sequência de dias
- Conquistas, perfil editável e tela de cursos com progresso
- Layout para desktop (menu lateral) e celular (menu inferior)
- Progresso salvo no navegador (`localStorage`), sem cadastro

## Estrutura

```
index.html          página única
css/                tokens da marca e estilos por área
js/main.js          rotas (por hash) e renderização
js/views/           telas: boas-vindas, trilha, lição, cursos, perfil
js/exercises/       um arquivo por tipo de exercício
js/check.js         correção das respostas (funções puras)
js/progress.js      regras de XP, vidas, sequência e conquistas
js/store.js         salvamento do progresso
data/courses/       conteúdo dos cursos
assets/brand/       logo e mascote
tests/              testes das regras
```

## Como adicionar um curso

1. Crie um arquivo em `data/courses/`, usando `ingles.js` como modelo.
2. Monte as unidades e lições com os atalhos de `data/builders.js`:

```js
import { choice, fill, order, input, match, lesson, unit } from '../builders.js';

export default {
  id: 'meu-curso',
  title: 'Meu curso',
  subtitle: 'Uma frase curta sobre o curso.',
  glyph: 'Aa',
  level: 'Iniciante',
  units: [
    unit('Título da unidade', 'Subtítulo', [
      lesson('meu-curso-1', 'Título da lição', [
        choice('Pergunta?', ['Certa', 'Errada', 'Errada', 'Errada'], 0),
        fill('Complete: eu ___ estudando.', ['estou', 'estão'], 0),
        order('Monte a frase.', 'Eu gosto de estudar', ['bolo']),
        input('Digite a resposta.', ['resposta']),
        match('Combine os pares.', [['a', 'A'], ['b', 'B']]),
      ]),
    ]),
  ],
};
```

3. Inclua o curso em `data/courses.js`, na lista `COURSES`.

Os ids das lições precisam ser únicos em toda a plataforma.

## Próximos passos possíveis

- Cadastro e login, com o progresso salvo em um servidor
- Fontes hospedadas no próprio projeto (hoje vêm do Google Fonts)
- Mais cursos e lições
