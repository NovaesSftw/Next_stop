import { choice, fill, order, input, match, lesson, unit } from '../builders.js';

export default {
  id: 'matematica',
  title: 'Matemática do dia a dia',
  subtitle: 'Operações, frações e porcentagem.',
  glyph: '÷',
  level: 'Iniciante',
  units: [
    unit('Operações', 'Somar, multiplicar e dividir', [
      lesson('mat-1', 'Soma e subtração', [
        choice('Quanto é 48 + 27?', ['75', '65', '85', '74'], 0),
        choice('Quanto é 91 − 36?', ['55', '65', '45', '57'], 0),
        input('Calcule: 120 − 45', ['75']),
        fill('Você tem R$ 50 e gasta R$ 18. Sobram R$ ___.', ['32', '28', '42', '68'], 0),
        match('Ligue cada conta ao resultado.', [
          ['25 + 25', '50'],
          ['100 − 1', '99'],
          ['7 + 8', '15'],
          ['30 − 12', '18'],
        ]),
      ]),
      lesson('mat-2', 'Multiplicação', [
        choice('Quanto é 7 × 8?', ['56', '54', '48', '63'], 0),
        fill('Uma caixa tem 6 ovos. 4 caixas têm ___ ovos.', ['24', '10', '20', '28'], 0, 'Multiplicar é somar a mesma quantidade várias vezes.'),
        input('Calcule: 12 × 5', ['60']),
        match('Ligue cada conta ao resultado.', [
          ['3 × 3', '9'],
          ['6 × 4', '24'],
          ['5 × 5', '25'],
          ['9 × 2', '18'],
        ]),
        choice('Qual é o resultado de 9 × 0?', ['0', '9', '1', '90'], 0, 'Qualquer número vezes zero dá zero.'),
      ]),
      lesson('mat-3', 'Divisão', [
        choice('Quanto é 56 ÷ 7?', ['8', '7', '9', '6'], 0),
        fill('Dividir 20 balas entre 4 amigos dá ___ balas para cada um.', ['5', '4', '6', '80'], 0),
        input('Calcule: 81 ÷ 9', ['9']),
        choice('Qual operação desfaz uma multiplicação?', ['Divisão', 'Subtração', 'Adição', 'Nenhuma'], 0),
        match('Ligue cada conta ao resultado.', [
          ['12 ÷ 3', '4'],
          ['18 ÷ 6', '3'],
          ['40 ÷ 8', '5'],
          ['35 ÷ 5', '7'],
        ]),
      ]),
    ]),
    unit('Frações e porcentagem', 'Partes de um todo', [
      lesson('mat-4', 'Frações', [
        choice('Uma pizza tem 8 fatias e você comeu 2. Que fração você comeu?', ['2/8', '8/2', '2/6', '6/8'], 0),
        choice('Qual fração é igual a 1/2?', ['2/4', '1/4', '3/4', '2/3'], 0),
        fill('1/4 + 1/4 = ___', ['2/4', '1/8', '2/8', '4/4'], 0, 'Com o mesmo denominador, some só os numeradores.'),
        match('Combine cada fração com o nome.', [
          ['1/2', 'metade'],
          ['1/4', 'um quarto'],
          ['3/4', 'três quartos'],
          ['1/1', 'o todo'],
        ]),
        choice('Qual fração é a maior?', ['3/4', '1/2', '1/4', '1/8'], 0),
      ]),
      lesson('mat-5', 'Porcentagem', [
        choice('Quanto é 50% de 80?', ['40', '50', '30', '60'], 0),
        choice('Quanto é 10% de 200?', ['20', '10', '2', '100'], 0),
        input('Quanto é 25% de 40?', ['10']),
        fill('Um tênis de R$ 100 com 20% de desconto custa R$ ___.', ['80', '20', '120', '90'], 0),
        match('Combine cada porcentagem com o significado.', [
          ['100%', 'o todo'],
          ['50%', 'metade'],
          ['25%', 'um quarto'],
          ['10%', 'um décimo'],
        ]),
      ]),
      lesson('mat-6', 'Problemas do dia a dia', [
        choice('Você compra 3 cadernos de R$ 12 cada. Quanto paga?', ['R$ 36', 'R$ 15', 'R$ 24', 'R$ 48'], 0),
        choice('Uma viagem de 90 km feita em 2 horas tem velocidade média de:', ['45 km/h', '180 km/h', '92 km/h', '30 km/h'], 0),
        input('Você tinha R$ 200 e gastou R$ 85. Quanto sobrou? (Só o número.)', ['115']),
        fill('Se 1 kg de arroz custa R$ 6, 5 kg custam R$ ___.', ['30', '11', '25', '60'], 0),
        order('Monte a conta do troco de R$ 50 para uma compra de R$ 32.', '50 - 32 = 18', ['+', '40']),
      ]),
    ]),
  ],
};
