import { choice, fill, order, input, match, lesson, unit } from '../builders.js';

export default {
  id: 'ingles',
  title: 'Inglês para começar',
  subtitle: 'Cumprimentos, família e frases do dia a dia.',
  glyph: 'Aa',
  level: 'Iniciante',
  units: [
    unit('Cumprimentos', 'Diga olá e se apresente', [
      lesson('ingles-1', 'Olá e tchau', [
        choice('Como se diz “olá” em inglês?', ['Hello', 'Goodbye', 'Please', 'Sorry'], 0),
        match('Combine cada palavra com o significado.', [
          ['Hello', 'Olá'],
          ['Goodbye', 'Tchau'],
          ['Thanks', 'Obrigado'],
          ['Please', 'Por favor'],
        ]),
        fill('Complete: ___ morning! (Bom dia!)', ['Good', 'Bad', 'Nice', 'Hello'], 0, 'Good morning é o cumprimento usado de manhã.'),
        order('Monte a frase: Até logo!', 'See you later!', ['hello', 'good']),
        input('Escreva em inglês: Obrigado', ['thank you', 'thanks']),
      ]),
      lesson('ingles-2', 'Eu sou...', [
        choice('Qual frase significa “Meu nome é Ana”?', ['My name is Ana.', 'You are Ana.', 'I like Ana.', 'Her name Ana.'], 0),
        fill('Complete: I ___ a student. (Eu sou estudante.)', ['am', 'is', 'are', 'be'], 0, 'Com “I”, usamos “am”.'),
        order('Monte a frase: Prazer em conhecer você.', 'Nice to meet you.', ['see', 'good']),
        match('Combine cada palavra com o significado.', [
          ['I', 'eu'],
          ['you', 'você'],
          ['name', 'nome'],
          ['friend', 'amigo'],
        ]),
        input('Escreva em inglês: Eu sou Maria. (Use “I am”.)', ['I am Maria', "I'm Maria"]),
      ]),
      lesson('ingles-3', 'Família', [
        choice('Qual palavra significa “irmã”?', ['sister', 'mother', 'daughter', 'aunt'], 0),
        match('Combine cada palavra com o significado.', [
          ['mother', 'mãe'],
          ['father', 'pai'],
          ['brother', 'irmão'],
          ['grandmother', 'avó'],
        ]),
        fill('Complete: This is my ___. (Esta é a minha mãe.)', ['mother', 'father', 'brother', 'uncle'], 0),
        order('Monte a frase: Ele é meu irmão.', 'He is my brother.', ['she', 'your']),
        choice('Como se diz “amigo” em inglês?', ['friend', 'family', 'teacher', 'neighbor'], 0),
      ]),
    ]),
    unit('Dia a dia', 'Comida, cores e números', [
      lesson('ingles-4', 'Comidas e bebidas', [
        match('Combine cada palavra com o significado.', [
          ['water', 'água'],
          ['bread', 'pão'],
          ['milk', 'leite'],
          ['apple', 'maçã'],
        ]),
        choice('O que significa “coffee”?', ['café', 'chá', 'suco', 'leite'], 0),
        fill('Complete: I drink ___. (Eu bebo água.)', ['water', 'bread', 'apple', 'rice'], 0, '“Drink” é beber e “eat” é comer.'),
        order('Monte a frase: Eu como pão.', 'I eat bread.', ['drink', 'milk']),
        input('Escreva em inglês: maçã', ['apple', 'an apple']),
      ]),
      lesson('ingles-5', 'Cores e números', [
        match('Combine cada cor com o significado.', [
          ['red', 'vermelho'],
          ['blue', 'azul'],
          ['green', 'verde'],
          ['yellow', 'amarelo'],
        ]),
        choice('Qual número é “three”?', ['2', '3', '4', '5'], 1),
        fill('Complete: The sky is ___. (O céu é azul.)', ['blue', 'red', 'green', 'black'], 0),
        order('Monte a frase: Eu tenho cinco maçãs.', 'I have five apples.', ['four', 'eat']),
        input('Escreva em inglês o número 10', ['ten']),
      ]),
      lesson('ingles-6', 'Frases com to be', [
        fill('Complete: She ___ my sister.', ['is', 'am', 'are', 'be'], 0, 'Com she, he e it, usamos “is”.'),
        fill('Complete: They ___ at home.', ['is', 'am', 'are', 'be'], 2, 'Com they, we e you, usamos “are”.'),
        choice('Qual frase está correta?', ['We are happy.', 'We is happy.', 'We am happy.', 'We be happy.'], 0),
        order('Monte a frase: Você está cansado.', 'You are tired.', ['is', 'am']),
        input('Escreva só o verbo que falta: I ___ hungry. (Eu estou com fome.)', ['am']),
      ]),
    ]),
  ],
};
