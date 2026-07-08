export interface MockTestQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MockAdminTest {
  id: string;
  title: string;
  description: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
  duration: string;
  questionsCount: number;
  xpReward: number;
  coinReward: number;
  category: string;
  questions: MockTestQuestion[];
}

export const adminTests: MockAdminTest[] = [
  {
    id: 'eng-b2',
    title: 'Ingliz tili (CEFR B2) Quiz',
    description: 'CEFR B2 darajasiga mos keladigan so\'z boyligi, grammatika va o\'qish ko\'nikmalarini sinab ko\'ring.',
    difficulty: "O'rta",
    duration: '15 daqiqa',
    questionsCount: 3,
    xpReward: 800,
    coinReward: 40,
    category: 'Ingliz tili',
    questions: [
      {
        q: "Choose the correct word: 'The results of the study were not statistically _______, so the hypothesis had to be rejected.'",
        options: ['significant', 'significance', 'significantly', 'signify'],
        correct: 0,
        explanation: "'Significant' is the correct adjective form here, modifying 'results' after the adverb 'statistically.' We need an adjective after a linking verb 'were'."
      },
      {
        q: "Which sentence demonstrates a correct conditional type 3 structure (Third Conditional, expressing regret about the past)?",
        options: [
          'If I would have known earlier, I will come to the party.',
          'If I had known earlier, I would have come to the party.',
          'If I have known earlier, I would come to the party.',
          'If I knew earlier, I would come to the party yesterday.'
        ],
        correct: 1,
        explanation: "'If + had + past participle' (Past Perfect) + 'would + have + past participle' is the correct Third Conditional structure."
      },
      {
        q: "Read the passage: 'Despite the heavy rainfall, the outdoor concert proceeded as planned. The organizers had installed waterproof covers over the stage and seating area, ensuring that the audience remained dry and comfortable throughout the performance.' What does the passage suggest?",
        options: [
          'The concert was cancelled due to bad weather.',
          'The organizers took measures to protect the venue from rain.',
          'The audience left early because of the rain.',
          'The concert was rescheduled for a later date.'
        ],
        correct: 1,
        explanation: "'Despite heavy rainfall' is the concession clause; the coordinating sentence says it 'proceeded as planned' and waterproof covers were installed."
      },
    ]
  },
  {
    id: 'math-iq',
    title: 'Matematika va Mantiqiy IQ Testi',
    description: 'O\'rta darajadagi arifmetika va mantiqiy fikrlash qobiliyatingizni sinang.',
    difficulty: "O'rta",
    duration: '12 daqiqa',
    questionsCount: 3,
    xpReward: 700,
    coinReward: 35,
    category: 'Matematika',
    questions: [
      {
        q: '1, 4, 9, 16, 25, ? Ketma-ketlikdagi keyingi sonni toping.',
        options: ['30', '36', '42', '49'],
        correct: 1,
        explanation: 'Bu ketma-ketlik kvadratlar ketma-ketligi: 1^2=1, 2^2=4, 3^2=9, 4^2=16, 5^2=25, shuning uchun 6^2=36.'
      },
      {
        q: "Agar bir kunda 8 soat ishlasangiz va bir soatda 25 ta detal ishlab chiqarsangiz, 1000 ta detalni necha kunda ishlab chiqarasiz?",
        options: ['3 kun', '4 kun', '5 kun', '6 kun'],
        correct: 2,
        explanation: 'Bir kunda 8 x 25 = 200 ta detal ishlab chiqariladi. 1000 / 200 = 5 kun.'
      },
      {
        q: "A shopkeeper bought a shirt for $20 and sold it for $25. What is his profit percentage?",
        options: ['20%', '25%', '30%', '50%'],
        correct: 1,
        explanation: "Profit = $25 - $20 = $5. Profit percentage = (5 / 20) * 100 = 25%."
      },
    ]
  },
  {
    id: 'uzbek-majburiy',
    title: 'Ona Tili (Majburiy Blok) Testi',
    description: 'Ona tili va adabiyot asoslari bo\'yicha test savollari.',
    difficulty: 'Oson',
    duration: '10 daqiqa',
    questionsCount: 3,
    xpReward: 600,
    coinReward: 30,
    category: 'Ona tili',
    questions: [
      {
        q: '"Kitob" so\'zining ko\'plik shakli qaysi?',
        options: ['Kitoblar', 'Kitobim', 'Kitobi', 'Kitobning'],
        correct: 0,
        explanation: "O'zbek tilida otlarning ko'plik shakli -lar qo'shimchasi orqali yasaladi: kitob + lar = kitoblar."
      },
      {
        q: "Qaysi gapda sifat qatnashgan?",
        options: ['U kitob o\'qidi.', 'Katta uy ko\'rindi.', 'Uyning tomi yashil.', 'Bolalar o\'ynamoqda.'],
        correct: 1,
        explanation: "'Katta' so'zi sifat bo'lib, 'uy' otining belgisini bildiradi."
      },
      {
        q: "Alisher Navoiyning 'Xamsa' asari necha dostondan iborat?",
        options: ['3 ta', '4 ta', '5 ta', '7 ta'],
        correct: 2,
        explanation: 'Alisher Navoiyning "Xamsa"si 5 dostondan iborat: Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab\'ai sayyor, Saddi Iskandariy.'
      },
    ]
  },
];
