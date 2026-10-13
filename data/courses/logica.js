import { choice, fill, order, input, match, lesson, unit } from '../builders.js';

export default {
  id: 'logica',
  title: 'Lógica de programação',
  subtitle: 'Pense como um computador, passo a passo.',
  glyph: '{ }',
  level: 'Iniciante',
  units: [
    unit('Pensando passo a passo', 'Algoritmos, variáveis e tipos de dados', [
      lesson('logica-1', 'O que é um algoritmo', [
        choice(
          'O que é um algoritmo?',
          ['Uma sequência de passos para resolver um problema', 'Um tipo de computador', 'Uma linguagem de programação', 'Um erro no programa'],
          0,
        ),
        order('Coloque os passos de fazer café na ordem certa.', 'Ferver a água | Passar no filtro | Servir o café', ['Lavar o carro']),
        choice('Qual destes é um algoritmo do dia a dia?', ['Uma receita de bolo', 'Uma foto de paisagem', 'Uma música', 'Um endereço'], 0),
        fill('Um algoritmo precisa ter passos em ___.', ['ordem', 'segredo', 'cores', 'dobro'], 0, 'A ordem dos passos muda o resultado.'),
        match('Combine cada termo com o significado.', [
          ['Entrada', 'O que o programa recebe'],
          ['Processamento', 'O que o programa faz com os dados'],
          ['Saída', 'O que o programa mostra'],
          ['Bug', 'Erro no programa'],
        ]),
      ]),
      lesson('logica-2', 'Variáveis', [
        choice('Para que serve uma variável?', ['Guardar um valor na memória', 'Desenhar na tela', 'Desligar o computador', 'Corrigir erros'], 0),
        fill('idade = 15\nidade = idade + 1\nO valor final de idade é ___.', ['15', '16', '1', '151'], 1, 'A variável recebe o valor antigo mais 1.'),
        choice('Qual nome de variável é mais claro?', ['preco_total', 'x1', 'aaa', 'coisa'], 0, 'Bons nomes dizem o que a variável guarda.'),
        order('Monte a atribuição: guarde 10 em pontos.', 'pontos = 10', ['==', 'guardar']),
        input('Se nome = "Ana", qual valor está guardado em nome? (Só o texto, sem aspas.)', ['Ana']),
      ]),
      lesson('logica-3', 'Tipos de dados', [
        match('Combine cada valor com o tipo.', [
          ['42', 'número inteiro'],
          ['3.14', 'número decimal'],
          ['"Olá"', 'texto'],
          ['verdadeiro', 'booleano'],
        ]),
        choice('Qual destes valores é um texto?', ['"banana"', '25', '3.5', 'verdadeiro'], 0, 'Texto vem entre aspas.'),
        choice('Que tipo de dado guarda só verdadeiro ou falso?', ['Booleano', 'Texto', 'Inteiro', 'Decimal'], 0),
        fill('O tipo de dado do número 7.5 é ___.', ['decimal', 'texto', 'booleano', 'lista'], 0),
        choice('Em muitas linguagens, juntar os textos "2" e "3" resulta em:', ['"23"', '5', 'um erro sempre', '"2+3"'], 0, 'Juntar textos é chamado de concatenação.'),
      ]),
    ]),
    unit('Decisões e repetições', 'Condições, laços e funções', [
      lesson('logica-4', 'Condições (if)', [
        choice(
          'Qual é a função do “se” (if)?',
          ['Executar um bloco só se a condição for verdadeira', 'Repetir algo para sempre', 'Guardar um valor', 'Encerrar o programa'],
          0,
        ),
        fill('Regra: se idade >= 18, mostrar "adulto". Com idade = 20, o programa mostra ___.', ['"adulto"', 'nada', 'um erro', '"criança"'], 0),
        match('Combine cada operador com o significado.', [
          ['==', 'igual a'],
          ['!=', 'diferente de'],
          ['>', 'maior que'],
          ['<=', 'menor ou igual a'],
        ]),
        order('Monte a regra: aprovar quem tirar 7 ou mais.', 'se nota >= 7 | então aprovado', ['senão repetir']),
        choice('Se x = 5, qual condição é verdadeira?', ['x > 3', 'x < 2', 'x == 6', 'x != 5'], 0),
      ]),
      lesson('logica-5', 'Laços (loops)', [
        choice('Para que serve um laço de repetição?', ['Repetir um bloco de instruções', 'Escolher entre dois caminhos', 'Guardar um texto', 'Apagar variáveis'], 0),
        fill('Repetir 3 vezes: mostrar "oi". Quantas vezes "oi" aparece na tela? ___', ['3', '1', '4', '0'], 0),
        choice(
          'contador = 0. Enquanto contador < 3: contador = contador + 1. Qual é o valor final de contador?',
          ['3', '2', '0', '4'],
          0,
        ),
        fill('Um laço que nunca termina é chamado de laço ___.', ['infinito', 'curto', 'vazio', 'duplo'], 0),
        match('Combine cada termo com o significado.', [
          ['for (para)', 'repete um número conhecido de vezes'],
          ['while (enquanto)', 'repete enquanto a condição for verdadeira'],
          ['break (parar)', 'sai do laço'],
          ['contador', 'variável que conta as repetições'],
        ]),
      ]),
      lesson('logica-6', 'Funções', [
        choice(
          'O que é uma função?',
          ['Um bloco de código com nome que pode ser reutilizado', 'Um tipo de variável', 'Um erro', 'Um comentário'],
          0,
        ),
        fill('Com somar(a, b) = a + b, a chamada somar(2, 3) resulta em ___.', ['5', '23', '6', '1'], 0),
        match('Combine cada termo com o significado.', [
          ['Parâmetro', 'valor que a função recebe'],
          ['Retorno', 'valor que a função devolve'],
          ['Chamada', 'usar a função no código'],
          ['Nome', 'como identificamos a função'],
        ]),
        order('Monte a definição: função saudar que mostra Olá.', 'função saudar() | mostrar "Olá"', ['repetir 3 vezes']),
        choice('Por que usar funções?', ['Para evitar repetir código', 'Para deixar o computador mais lento', 'Para esconder erros', 'Para trocar o sistema'], 0),
      ]),
    ]),
  ],
};
