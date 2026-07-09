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
  {
    id: 'fizika-1',
    title: 'Fizika (Mexanika) Testi',
    description: 'Nyuton qonunlari, kinematika va dinamikaga oid asosiy tushunchalar.',
    difficulty: "O'rta",
    duration: '15 daqiqa',
    questionsCount: 5,
    xpReward: 850,
    coinReward: 45,
    category: 'Fizika',
    questions: [
      {
        q: 'Nyutonning birinchi qonuni (inersiya qonuni) qanday ta\'riflanadi?',
        options: [
          'Jismga ta\'sir etuvchi kuch uning massasi va tezlanishi ko\'paytmasiga teng.',
          'Har bir ta\'sir uchun teng va qarama-qarshi ta\'sir mavjud.',
          'Jismga tashqi kuch ta\'sir etmasa, u tinch holatda yoki to\'g\'ri chiziqli tekis harakatda qoladi.',
          'Jismning tezlanishi unga qo\'yilgan kuchga to\'g\'ri proporsional.'
        ],
        correct: 2,
        explanation: 'Nyutonning birinchi qonuni: jismga tashqi kuch ta\'sir etmaguncha, u o\'zining tinch holatini yoki to\'g\'ri chiziqli tekis harakatini saqlaydi.'
      },
      {
        q: 'Erkin tushayotgan jismning tezlanishi qanday nomlanadi va uning taxminiy qiymati qancha?',
        options: [
          'Og\'irlik kuchi, 9.8 N/kg',
          'Erkin tushish tezlanishi, 9.8 m/s²',
          'Markazga intilma tezlanish, 9.8 m/s',
          'Boshlang\'ich tezlik, 0 m/s²'
        ],
        correct: 1,
        explanation: 'Erkin tushish tezlanishi g ≈ 9.8 m/s² ga teng. Bu Yerning tortishish kuchi ta\'sirida jismlarning oladigan tezlanishidir.'
      },
      {
        q: 'Agar avtomobil 20 m/s tezlik bilan harakatlanayotgan bo\'lsa va birdan tormoz berilsa, ishqalanish kuchi qaysi tomonga yo\'nalgan?',
        options: [
          'Harakat yo\'nalishi bo\'ylab oldinga',
          'Harakat yo\'nalishiga teskari',
          'Yuqoriga',
          'Pastga'
        ],
        correct: 1,
        explanation: 'Ishqalanish kuchi har doim harakatga qarama-qarshi yo\'nalgan bo\'ladi. Tormozlanganda ishqalanish kuchi avtomobilni to\'xtatish uchun harakat yo\'nalishiga teskari ta\'sir qiladi.'
      },
      {
        q: 'Ish formula bilan ifodalansa, qaysi javob to\'g\'ri?',
        options: [
          'A = F · t (kuch va vaqt ko\'paytmasi)',
          'A = F · s (kuch va yo\'l ko\'paytmasi)',
          'A = m · g (massa va tezlanish ko\'paytmasi)',
          'A = F / s (kuchning yo\'lga nisbati)'
        ],
        correct: 1,
        explanation: 'Mexanik ish A = F · s formula bilan ifodalanadi, bu yerda F — kuch, s — kuch ta\'siridagi yo\'l.'
      },
      {
        q: 'Energiyaning saqlanish qonuniga ko\'ra, yopiq tizimda...',
        options: [
          'Energiya yo\'qoladi va qayta tiklanmaydi.',
          'Energiya bir turdan ikkinchi turga o\'tadi, lekin umumiy miqdori o\'zgarmaydi.',
          'Energiya faqat ko\'payadi.',
          'Energiya faqat kamayadi.'
        ],
        correct: 1,
        explanation: 'Energiyaning saqlanish qonuni: yopiq tizimda energiya yo\'qolmaydi va yo\'qdan paydo bo\'lmaydi, faqat bir shakldan boshqa shaklga o\'zgaradi.'
      },
    ]
  },
  {
    id: 'kimyo-1',
    title: 'Kimyo (Elementlar va Birikmalar)',
    description: 'Davriy jadval, kimyoviy bog\'lanishlar va reaksiya tenglamalari.',
    difficulty: "O'rta",
    duration: '12 daqiqa',
    questionsCount: 5,
    xpReward: 750,
    coinReward: 40,
    category: 'Kimyo',
    questions: [
      {
        q: 'Suvning kimyoviy formulasi qaysi?',
        options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
        correct: 1,
        explanation: 'Suvning kimyoviy formulasi H₂O — ikki vodorod atomi va bir kislorod atomidan iborat.'
      },
      {
        q: 'Mendeleyev davriy jadvalida elementlar qanday tartibda joylashgan?',
        options: [
          'Alfavit tartibida',
          'Atom massasining ortish tartibida',
          'Atom raqamining ortish tartibida',
          'Kashf etilgan vaqtiga ko\'ra'
        ],
        correct: 2,
        explanation: 'Davriy jadvalda elementlar atom raqami (protonlar soni) ortib borish tartibida joylashgan.'
      },
      {
        q: 'Kislota va asos o\'rtasidagi reaksiya qanday nomlanadi?',
        options: [
          'Oksidlanish reaksiyasi',
          'Neytrallash reaksiyasi',
          'Parchalanish reaksiyasi',
          'Almashinish reaksiyasi'
        ],
        correct: 1,
        explanation: 'Kislota va asos o\'rtasidagi reaksiya neytrallash reaksiyasi deb ataladi, natijada tuz va suv hosil bo\'ladi.'
      },
      {
        q: 'Quyidagilardan qaysi biri inert (nodir) gaz hisoblanadi?',
        options: ['Kislorod (O)', 'Vodorod (H)', 'Neon (Ne)', 'Xlor (Cl)'],
        correct: 2,
        explanation: 'Neon (Ne) inert (nodir) gazdir. Nodir gazlar juda kam reaksiyaga kirishadi va 8 ta valent elektroniga ega.'
      },
      {
        q: 'Kimyoviy bog\'lanishda elektronlarni bir atomdan ikkinchisiga o\'tishi qanday bog\' deyiladi?',
        options: [
          'Kovalent bog\'',
          'Ion bog\'',
          'Vodorod bog\'',
          'Metall bog\''
        ],
        correct: 1,
        explanation: 'Ion bog\'da elektronlar bir atomdan ikkinchisiga to\'liq o\'tadi, natijada musbat va manfiy ionlar hosil bo\'ladi.'
      },
    ]
  },
  {
    id: 'tarix-1',
    title: 'Jahon Tarixi (XX Asr)',
    description: 'XX asrdagi muhim tarixiy voqealar, shaxslar va jarayonlar.',
    difficulty: "O'rta",
    duration: '15 daqiqa',
    questionsCount: 5,
    xpReward: 800,
    coinReward: 40,
    category: 'Tarix',
    questions: [
      {
        q: 'Ikkinchi Jahon urushi qaysi yillarda bo\'lib o\'tdi?',
        options: ['1914-1918', '1939-1945', '1945-1950', '1929-1933'],
        correct: 1,
        explanation: 'Ikkinchi Jahon urushi 1939-yil 1-sentabrda Germaniyaning Polshaga bosqini bilan boshlanib, 1945-yil 2-sentabrda Yaponiyaning taslim bo\'lishi bilan tugadi.'
      },
      {
        q: 'Birlashgan Millatlar Tashkiloti (BMT) qachon tashkil etilgan?',
        options: ['1919', '1939', '1945', '1955'],
        correct: 2,
        explanation: 'BMT 1945-yil 24-oktabrda 51 ta davlat tomonidan Ikkinchi Jahon urushidan keyin tinchlik va xavfsizlikni saqlash maqsadida tashkil etilgan.'
      },
      {
        q: 'Kim "Men bir orzuim bor" (I Have a Dream) nutqi bilan tanilgan?',
        options: [
          'Mahatma Gandhi',
          'Malcolm X',
          'Martin Luther King Jr.',
          'Nelson Mandela'
        ],
        correct: 2,
        explanation: 'Martin Luther King Jr. 1963-yil 28-avgustda Vashingtondagi marshda "I Have a Dream" nutqini so\'zlagan.'
      },
      {
        q: 'Sovet Ittifoqi qaysi yilda parchalandi?',
        options: ['1989', '1990', '1991', '1993'],
        correct: 2,
        explanation: 'Sovet Ittifoqi 1991-yil 26-dekabrda rasman parchalandi. O\'zbekiston 1991-yil 1-sentabrda mustaqillikka erishdi.'
      },
      {
        q: 'Buyuk Ipak Yo\'lining eng gullagan davri qaysi asrlarga to\'g\'ri keladi?',
        options: [
          'Mil.avv. II-I asrlar',
          'VII-VIII asrlar',
          'XIII-XIV asrlar',
          'XVIII-XIX asrlar'
        ],
        correct: 2,
        explanation: 'Buyuk Ipak Yo\'li eng gullagan davri XIII-XIV asrlarga to\'g\'ri keladi, ayniqsa Mo\'g\'ullar imperiyasi davrida savdo yo\'llari xavfsizligi ta\'minlangan.'
      },
    ]
  },
  {
    id: 'informatika-1',
    title: 'Informatika va Dasturlash Asoslari',
    description: 'Kompyuter savodxonligi, algoritmlar va dasturlashga kirish.',
    difficulty: 'Oson',
    duration: '10 daqiqa',
    questionsCount: 5,
    xpReward: 650,
    coinReward: 30,
    category: 'Informatika',
    questions: [
      {
        q: 'Kompyuterning "miyasi" qaysi qurilma hisoblanadi?',
        options: ['Monitor', 'Protsessor (CPU)', 'Qattiq disk (HDD)', 'Operativ xotira (RAM)'],
        correct: 1,
        explanation: 'Protsessor (CPU — Central Processing Unit) kompyuterning "miyasi" bo\'lib, barcha hisoblash va boshqarish operatsiyalarini bajaradi.'
      },
      {
        q: 'Quyidagilardan qaysi biri dasturlash tili hisoblanadi?',
        options: ['HTML', 'Python', 'HTTP', 'SQL'],
        correct: 1,
        explanation: 'Python — bu yuqori darajadagi dasturlash tili. HTML belgilash tili, HTTP protokol, SQL esa ma\'lumotlar bazasi tili.'
      },
      {
        q: 'Algoritm deganda nima tushuniladi?',
        options: [
          'Kompyuterning texnik qismi',
          'Muammoni yechish uchun aniq ketma-ketlikdagi qadamlar',
          'Ma\'lumotlar bazasi tuzilmasi',
          'Internet tarmog\'i protokoli'
        ],
        correct: 1,
        explanation: 'Algoritm — bu biror muammoni yechish yoki maqsadga erishish uchun aniq belgilangan, ketma-ket bajariladigan qadamlar majmui.'
      },
      {
        q: 'Ma\'lumotlarni saqlash uchun eng kichik birlik qaysi?',
        options: ['Bayt', 'Bit', 'Kilobayt', 'Megabayt'],
        correct: 1,
        explanation: 'Bit (binary digit) — ma\'lumotlarni saqlashning eng kichik birligi bo\'lib, 0 yoki 1 qiymatini qabul qiladi. 1 bayt = 8 bit.'
      },
      {
        q: 'Internetda veb-sahifalarni ko\'rish uchun qaysi protokol ishlatiladi?',
        options: ['FTP', 'SMTP', 'HTTP/HTTPS', 'TCP/IP'],
        correct: 2,
        explanation: 'HTTP (HyperText Transfer Protocol) va uning xavfsiz versiyasi HTTPS veb-sahifalarni brauzerda ko\'rish uchun ishlatiladi.'
      },
    ]
  },
  {
    id: 'biologiya-1',
    title: 'Biologiya (Genetika va Hujayra)',
    description: 'Hujayra tuzilishi, genetik kod va DNK replikatsiyasi haqida murakkab savollar.',
    difficulty: 'Qiyin',
    duration: '20 daqiqa',
    questionsCount: 6,
    xpReward: 1000,
    coinReward: 55,
    category: 'Biologiya',
    questions: [
      {
        q: 'DNK molekulasining shakli qanday?',
        options: [
          'Bir zanjirli spiral',
          'Ikki zanjirli geliks (qo\'sh spiral)',
          'Uch zanjirli halqa',
          'To\'g\'ri chiziqli tuzilma'
        ],
        correct: 1,
        explanation: 'DNK (dezoksiribonuklein kislotasi) ikki zanjirli qo\'sh spiral (double helix) shakliga ega bo\'lib, uni Watson va Crick 1953-yilda kashf etgan.'
      },
      {
        q: 'Genotip va fenotip o\'rtasidagi farq nimada?',
        options: [
          'Genotip — tashqi ko\'rinish, fenotip — genetik kod',
          'Genotip — irsiy genetik tuzilma, fenotip — tashqi belgilar majmui',
          'Genotip va fenotip bir xil tushunchalar',
          'Genotip — faqat hujayrada, fenotip — organizmda'
        ],
        correct: 1,
        explanation: 'Genotip — organizmning barcha genlari yig\'indisi, fenotip — genotipning tashqi muhit bilan o\'zaro ta\'siri natijasida namoyon bo\'ladigan belgilar.'
      },
      {
        q: 'Mitos va meyoz jarayonlari o\'rtasidagi asosiy farq nima?',
        options: [
          'Mitozda 2 ta hujayra, meyozda 4 ta hujayra hosil bo\'ladi',
          'Mitozda xromosomalar soni ikki barobar kamayadi',
          'Meyoz faqat o\'simliklarda uchraydi',
          'Hech qanday farq yo\'q'
        ],
        correct: 0,
        explanation: 'Mitozda bitta hujayradan ikkita (2n) hujayra, meyozda bitta hujayradan to\'rtta (n) hujayra hosil bo\'ladi. Meyozda xromosomalar soni ikki barobar kamayadi.'
      },
      {
        q: 'Odam organizmida qancha xromosoma mavjud?',
        options: ['23 ta', '44 ta', '46 ta', '48 ta'],
        correct: 2,
        explanation: 'Odam organizmida 46 ta (23 juft) xromosoma mavjud. Shundan 1 juft jinsiy xromosomalar (XX yoki XY), 22 juft autosom xromosomalar.'
      },
      {
        q: 'Fotosintez jarayonida qanday gaz ajralib chiqadi?',
        options: ['Karbonat angidrid (CO₂)', 'Kislorod (O₂)', 'Azot (N₂)', 'Vodorod (H₂)'],
        correct: 1,
        explanation: 'Fotosintez jarayonida o\'simliklar quyosh energiyasidan foydalanib, suv va karbonat angidriddan organik moddalar sintez qiladi va kislorod (O₂) ajralib chiqadi.'
      },
      {
        q: 'Odamning qon guruhlarini kim kashf etgan?',
        options: [
          'Gregor Mendel',
          'Karl Landsteiner',
          'Charlz Darvin',
          'Robert Kox'
        ],
        correct: 1,
        explanation: 'Karl Landsteiner 1901-yilda odamning asosiy qon guruhlarini (A, B, AB va 0) kashf etgan va buning uchun Nobel mukofotiga sazovor bo\'lgan.'
      },
    ]
  },
  {
    id: 'ingliz-c1',
    title: 'Ingliz tili (CEFR C1) Advanced',
    description: 'Advanced vocabulary, complex grammar structures, and academic reading comprehension at CEFR C1 level.',
    difficulty: 'Qiyin',
    duration: '20 daqiqa',
    questionsCount: 5,
    xpReward: 1100,
    coinReward: 60,
    category: 'Ingliz tili',
    questions: [
      {
        q: "Choose the correct word: 'The professor's argument was so _______ that even his critics had to acknowledge its validity.'",
        options: ['compelling', 'compellable', 'compulsive', 'compulsory'],
        correct: 0,
        explanation: "'Compelling' means extremely convincing and difficult to ignore. The others have different meanings: 'compellable' (can be forced), 'compulsive' (obsessive), 'compulsory' (mandatory)."
      },
      {
        q: "Which sentence uses 'nevertheless' correctly?",
        options: [
          'He was tired, nevertheless he continued working.',
          'Nevertheless the rain, we went outside.',
          'She studied hard; nevertheless, she failed the exam.',
          'I like coffee nevertheless tea.'
        ],
        correct: 2,
        explanation: "'Nevertheless' is a conjunctive adverb meaning 'in spite of that.' It typically connects two independent clauses with a semicolon or starts a new sentence."
      },
      {
        q: "What is the correct form? 'Had I known about the meeting, I _______ earlier.'",
        options: [
          'will have arrived',
          'would have arrived',
          'would arrive',
          'arrived'
        ],
        correct: 1,
        explanation: 'This is a third conditional with inversion. The full form is "If I had known, I would have arrived earlier." Inversion drops "if" and places "had" at the beginning.'
      },
      {
        q: "Read the passage: 'The ubiquity of digital technology has engendered a paradigm shift in pedagogical methodologies, necessitating a concomitant reevaluation of traditional assessment criteria.' What is the author's main claim?",
        options: [
          'Digital technology is too expensive for schools.',
          'Teaching methods have changed because of technology, and testing must change too.',
          'Traditional assessment is better than digital assessment.',
          'Students prefer digital textbooks over printed ones.'
        ],
        correct: 1,
        explanation: 'The passage states digital technology created a "paradigm shift" in teaching methods, which "necessitates a reevaluation" of assessment criteria — meaning testing must change alongside teaching.'
      },
      {
        q: "Which word is closest in meaning to 'ameliorate'?",
        options: ['Worsen', 'Improve', 'Stabilize', 'Ignore'],
        correct: 1,
        explanation: "'Ameliorate' means to make something bad or unsatisfactory better. It is a formal synonym for 'improve'."
      },
    ]
  },
  {
    id: 'geometriya-1',
    title: 'Geometriya (Planimetriya)',
    description: 'Geometrik shakllar, teoremalar va maydon hisoblash bo\'yicha test.',
    difficulty: 'Oson',
    duration: '10 daqiqa',
    questionsCount: 5,
    xpReward: 700,
    coinReward: 35,
    category: 'Matematika',
    questions: [
      {
        q: 'To\'g\'ri to\'rtburchakning yuzi qanday formula bilan hisoblanadi?',
        options: [
          'S = a · b (tomonlar ko\'paytmasi)',
          'S = 2(a + b)',
          'S = a²',
          'S = π · r²'
        ],
        correct: 0,
        explanation: 'To\'g\'ri to\'rtburchakning yuzi uning ikki tomonining ko\'paytmasiga teng: S = a · b.'
      },
      {
        q: 'Pifagor teoremasiga ko\'ra, to\'g\'ri burchakli uchburchakda gipotenuza...',
        options: [
          'Katetlarning yig\'indisiga teng',
          'Katetlar kvadratlari yig\'indisining kvadrat ildiziga teng',
          'Katetlarning ayirmasiga teng',
          'Katetlar ko\'paytmasiga teng'
        ],
        correct: 1,
        explanation: 'Pifagor teoremasi: c² = a² + b², shuning uchun c = √(a² + b²), ya\'ni gipotenuza katetlar kvadratlari yig\'indisining kvadrat ildiziga teng.'
      },
      {
        q: 'Aylana uzunligi qanday formula bilan hisoblanadi?',
        options: ['L = 2πr', 'L = πr²', 'L = 2r', 'L = πd²'],
        correct: 0,
        explanation: 'Aylana uzunligi L = 2πr (yoki L = πd) formula bilan hisoblanadi, bu yerda r — radius, d — diametr.'
      },
      {
        q: 'Uchburchakning ichki burchaklari yig\'indisi necha gradus?',
        options: ['90°', '180°', '270°', '360°'],
        correct: 1,
        explanation: 'Har qanday uchburchakning ichki burchaklari yig\'indisi 180° (π radian) ga teng.'
      },
      {
        q: 'Kvadratning perimetri 24 sm bo\'lsa, uning yuzi necha sm²?',
        options: ['24 sm²', '36 sm²', '48 sm²', '144 sm²'],
        correct: 1,
        explanation: 'Kvadrat perimetri P = 4a = 24 sm, demak a = 6 sm. Yuzi S = a² = 36 sm².'
      },
    ]
  },
];
