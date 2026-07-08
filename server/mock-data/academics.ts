export interface MockQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const ieltsReading: MockQuestion[] = [
  {
    q: "The primary purpose of academic paragraphs is to present...",
    options: ["A collection of at least ten loosely-related sentences", "Exactly one main central idea supported by structured evidence", "Passive voice structures as much as possible", "Personal anecdotes without citations"],
    correct: 1,
    explanation: "A strong academic paragraph focuses on one cohesive central topic sentence followed by logical analysis and supporting proof."
  },
  {
    q: "Which transition word is best suited to show a contrast between two opposite theories?",
    options: ["Furthermore", "Consequently", "On the other hand", "In addition"],
    correct: 2,
    explanation: "'On the other hand' is used to present alternative points of view or contrasting facts."
  },
  {
    q: "What does 'skimming' mean in the context of the IELTS Reading section?",
    options: ["Reading every word carefully to find spelling errors", "Translating the passage into your native language word-by-word", "Reading rapidly to get a general overview or main idea of the text", "Memorizing the vocabulary of the first paragraph"],
    correct: 2,
    explanation: "Skimming is a speed-reading technique used to grasp the main structure and key points of a passage quickly."
  },
];

export const ieltsListening: MockQuestion[] = [
  {
    q: "[Audio Clip transcript: 'The public museum will open at 10:00 AM on weekdays and close at 6:00 PM.']. At what time does the museum open on Wednesdays?",
    options: ["09:00 AM", "10:00 AM", "06:00 PM", "12:00 PM"],
    correct: 1,
    explanation: "The transcript clearly states that on weekdays (which includes Wednesday), the museum opens at 10:00 AM."
  },
  {
    q: "[Audio Clip transcript: 'The total cost of the annual membership is fifty-five dollars.']. How much is the annual membership?",
    options: ["$15", "$50", "$55", "$65"],
    correct: 2,
    explanation: "The speaker states the cost is fifty-five dollars ($55)."
  },
];

export const satMath: MockQuestion[] = [
  {
    q: "If 3x + 5 = 20, what is the value of 6x - 5?",
    options: ["25", "35", "30", "15"],
    correct: 0,
    explanation: "First, solve for x: 3x = 15 => x = 5. Now substitute x = 5 into 6x - 5: 6(5) - 5 = 30 - 5 = 25."
  },
  {
    q: "A line in the xy-plane passes through the origin and has a slope of 1/3. Which of the following points lies on the line?",
    options: ["(1, 3)", "(3, 1)", "(3, 3)", "(1, 1)"],
    correct: 1,
    explanation: "The equation of the line is y = (1/3)x. Substituting the point (3, 1): 1 = (1/3)*3 which is true."
  },
  {
    q: "For a certain function f, f(x) = x^2 - 3. What is f(5)?",
    options: ["10", "22", "25", "28"],
    correct: 1,
    explanation: "Substitute x = 5 into the function: f(5) = 5^2 - 3 = 25 - 3 = 22."
  },
];

export const satEnglish: MockQuestion[] = [
  {
    q: "Which word is closest in meaning to 'venerable' as used to describe an old university building?",
    options: ["Respected", "Ancient", "Outdated", "Fragile"],
    correct: 0,
    explanation: "'Venerable' implies a high degree of respect accorded to an institution due to its age, dignity, or historic value."
  },
  {
    q: "Although many people believe that wolves are inherently aggressive, modern ecological studies suggest they are actually _______ animals that avoid conflict whenever possible.",
    options: ["ferocious", "docile", "predatory", "solitary"],
    correct: 1,
    explanation: "The transition word 'although' indicates contrast. The sentence counters the belief that wolves are aggressive, so they are described as 'docile' or peaceful/avoiding conflict."
  },
  {
    q: "Choose the word that best completes the sentence: The researcher's findings were so ______ that they left no room for doubt or debate.",
    options: ["ambiguous", "unequivocal", "speculative", "trivial"],
    correct: 1,
    explanation: "'Unequivocal' means leaving no doubt; clear, unambiguous. This fits the clue 'left no room for doubt'."
  },
];

export const milliyMath: MockQuestion[] = [
  {
    q: "f(x) = 2x + 3 funksiyaning hosilasini toping.",
    options: ["2", "3", "2x", "x^2"],
    correct: 0,
    explanation: "Chiziqli funksiyaning hosilasi uning burchak koeffitsiyentiga teng: f'(x) = 2."
  },
  {
    q: "Agar geometrik progressiyada b1 = 3 va maxraj q = 2 bo'lsa, b4 ni toping.",
    options: ["12", "24", "48", "6"],
    correct: 1,
    explanation: "Geometrik progressiya formulasi: bn = b1 * q^(n-1). b4 = 3 * 2^3 = 3 * 8 = 24."
  },
];

export const milliyPhysics: MockQuestion[] = [
  {
    q: "Nyutonning ikkinchi qonuni formulasini ko'rsating.",
    options: ["F = m * a", "E = m * c^2", "P = U * I", "v = s / t"],
    correct: 0,
    explanation: "Nyutonning ikkinchi qonuniga ko'ra, jismga ta'sir qiluvchi kuch uning massasi va tezlanishi ko'paytmasiga teng: F = ma."
  },
  {
    q: "Issiqlik miqdori qaysi birlikda o'lchanadi?",
    options: ["Vatt", "Joul", "Nyuton", "Paskal"],
    correct: 1,
    explanation: "Xalqaro birliklar sistemasida issiqlik miqdori va energiya Joul (J) larda o'lchanadi."
  },
];

export const milliyNative: MockQuestion[] = [
  {
    q: "\"Sariq sochli bola kitob o'qidi.\" Ushbu gapda nechta aniqlovchi bor?",
    options: ["1 ta", "2 ta", "Hech qaysi", "3 ta"],
    correct: 0,
    explanation: "'Sariq sochli' - 1 ta sifatlovchi aniqlovchi bo'lib keladi."
  },
  {
    q: "Quyidagilardan qaysi biri kelishik qo'shimchasi hisoblanadi?",
    options: ["-ning", "-roq", "-lar", "-miz"],
    correct: 0,
    explanation: "-ning qaratqich kelishigi qo'shimchasidir."
  },
];

export const ieltsFull = [...ieltsReading, ...ieltsListening];
export const satFull = [...satMath, ...satEnglish];
export const milliyFull = [...milliyMath, ...milliyPhysics, ...milliyNative];
