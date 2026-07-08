# LifeSprint imkoniyatlari tahlili

Ushbu hujjat loyiha kod bazasining joriy holatiga asoslanadi. Maqsad:

- ilovada mavjud barcha asosiy funksiyalarni sanab chiqish;
- ular qanday ishlashini logika nuqtai nazaridan tushuntirish;
- kuchli va zaif tomonlarini ko'rsatish;
- keyingi yangilashlar uchun aniq yo'nalish berish.

## 1. Loyihaning umumiy ko'rinishi

LifeSprint - bu ta'lim, gamification, konsultatsiya, test tayyorlash, portfolio va community funksiyalarini bitta platformada birlashtirgan web-ilova.

Ilova quyidagi qatlamlardan iborat:

- Frontend: React + Vite + TypeScript.
- State management: Zustand.
- UI: Tailwind CSS.
- Routing: HashRouter.
- Backend: Express.
- Auth: JWT asosidagi login/register.
- Data storage: user_state, notifications, users va mock API endpointlar.

## 2. Asosiy arxitektura

Ilova ikkita asosiy oqimdan ishlaydi:

- Auth oqimi: foydalanuvchi kiradi, token localStorage'da saqlanadi, `/api/auth/me` orqali sessiya tiklanadi.
- App oqimi: foydalanuvchi kirgach, `currentTab` va global store orqali modullar almashadi, state esa `/api/state` ga yoziladi.

Muhim mexanizmlar:

- `src/main.tsx` dark mode'ni sahifa ochilishidan oldin localStorage orqali yoqadi.
- `src/store.ts` foydalanuvchi holatini boshqaradi.
- `src/api.ts` backend bilan barcha so'rovlarni markazlashtiradi.
- `server/state.ts` user state'ni saqlaydi va default ma'lumotlarni qaytaradi.
- `server/actions.ts` gamification, kurs, guruh va sertifikat kabi amallarni bajaradi.

## 3. Ilovadagi mavjud imkoniyatlar

### 3.1 Auth va sessiya

- Ro'yxatdan o'tish.
- Login.
- Token orqali sessiyani tiklash.
- Logout.
- Rol tanlash: `student`, `teacher`, `parent`, `admin`.

Ishlash logikasi:

- Register va login `server/auth.ts` orqali ishlaydi.
- Token localStorage'da saqlanadi.
- Sahifa ochilganda token bo'lsa `/api/auth/me` chaqiriladi.
- Auth bo'lmasa `AuthScreen` ko'rsatiladi.

### 3.2 Global layout

- Chap sidebar navigatsiya.
- Yuqori header.
- Mobil menu ochish/yopish.
- Dark mode / light mode.
- Bildirishnomalar paneli.
- Profil menyusi.
- Level va XP modal.
- Tasdiqlash dialogi.
- Error boundary.

### 3.3 Dashboard

Dashboard markaziy hub sifatida ishlaydi va roldan kelib chiqib turli view'larni ko'rsatadi.

Student uchun:

- Overview.
- Guruhlar.
- MOOC / Kurslar do'koni.
- Quizlar.
- Testlar.
- Uy vazifalari.
- Consulting.
- Reyting.
- Sertifikatlar.

Teacher uchun:

- Dars yuklash.
- Guruh yaratish.
- Kurs yaratish.
- Quiz yaratish.
- O'quvchi qo'shish.
- Sertifikat berish.

Parent uchun:

- Ota-ona monitoring paneli.
- Farzand odatlari va XP ko'rsatkichlarini kuzatish.

Admin uchun:

- Foydalanuvchilar paneli.
- Kurslar paneli.
- To'lovlar paneli.
- Statistika paneli.

### 3.4 Akademik modul

`Academics` bo'limi platformaning eng katta qismi hisoblanadi.

Imkoniyatlar:

- IELTS, SAT va Milliy sertifikat yo'nalishlari.
- Reading, Listening, Writing, Speaking, Math va boshqa mock testlar.
- Test natijasiga qarab XP/coin mukofoti.
- Kurs sotish va xarid qilish.
- Kurs yaratish.
- Guruh yaratish va avtomatik guruhga qo'shish.
- Guruh chat.
- AI feedback.
- Yozma va og'zaki javoblar uchun baholash oqimi.

Logika:

- Mock testlar `server/mock-data/academics.ts` va `server/mock-data/tests.ts` dan olinadi.
- Foydalanuvchi testni yakunlaganda `api.reward(...)` yoki `rewardAndUpdate(...)` orqali XP beradi.
- Kurs sotib olinganda user state yangilanadi va kurs `enrolled` bo'ladi.
- Kurs yaratish va guruh yaratish backendga yuboriladi va `user_state` ichiga yoziladi.

### 3.5 Test Markazi

`TestCenter` quyidagilarni beradi:

- Admin testlar ro'yxati.
- Testni boshlash.
- Savolma-savol ishlash.
- Yakuniy natija.
- Past natija bo'lsa Pandoo yordamchi oynasi.

### 3.6 Competition

Reyting va liga tizimi:

- Olmos liga.
- Oltin liga.
- Bronza liga.
- SAT, IELTS, Milliy, Quiz va XP bo'yicha saralash.
- Qidiruv.
- Ligalar orasida ko'tarilish/tushish qoidalari.
- Sovg'a yuborish orqali XP olish.

### 3.7 Discipline

Intizom va fokus bloki quyidagilarni o'z ichiga oladi:

- Pomodoro timer.
- Study / break rejimi.
- Habit tracking.
- Kunlik odatlar tarixini saqlash.
- Progress chart.
- Ambient sound generator: rain, wind, alpha.
- Fullscreen focus rejimi.

### 3.8 Mooc Store

MOOC / kurslar do'koni:

- Kurslarni ko'rish.
- Kurs sotib olish.
- Tanga yetmasa grant simulyatsiyasi.
- Yangi kurs yaratish.
- Kursga tegishli guruhni avtomatik ochish.
- Dars va chat oqimlari.

### 3.9 Community

Jamiyat va forum:

- Yangi post yaratish.
- Postlarni like qilish.
- Reyting jadvali.
- Vebinarlar ro'yxati.
- Vebinarga ro'yxatdan o'tish.

### 3.10 AI Coach

AI murabbiy:

- Gemini API orqali savol-javob.
- Shaxsiy o'quv reja generatsiyasi.
- Tayyor suggestion promptlar.
- AI bilan muloqot uchun XP mukofoti.

### 3.11 University va Consulting

Universitet/konsultatsiya qismi:

- Universitet qidirish.
- Grantlar ro'yxati.
- Moslik hisoblash.
- Talablar, GPA, IELTS, SAT, tuition va acceptance rate.
- Shaxsiy roadmap.
- Konsultatsiya bron qilish.

### 3.12 Portfolio

Portfolio builder:

- Asosiy profil ma'lumotlari.
- Bio.
- Ta'lim.
- SAT / IELTS ballari.
- Olimpiada natijalari.
- Mukofotlar.
- Loyiha ro'yxati.
- Volunteering.
- Resume/portfolio preview.
- Print orqali eksport.

### 3.13 Game Zone

Gamification markazi:

- Achievements.
- Daily va weekly quests.
- Quest claim.
- Titles / unvonlar.
- Title equip.
- Season pass progress.
- XP, coin va level ko'rsatkichlari.

### 3.14 Parent Panel

- Farzand faolligini ko'rish.
- Odatlar progressi.
- Akademik dinamikani ko'rish.
- Ota-ona uchun tavsiyalar.
- Teacher mode orqali uy vazifasi yaratish simulyatsiyasi.

### 3.15 Teacher Panel

- Dars qo'shish.
- Guruh yaratish.
- Kurs yaratish.
- Quiz yaratish.
- O'quvchi qo'shish.
- Sertifikat berish.

### 3.16 Header funksiyalari

- Dashboardga qaytish.
- Notifications.
- Dark mode toggle.
- Profil ochiladigan menyu.
- Role switch.
- Current level va XP summary.

### 3.17 Level Modal

- Umumiy XP ko'rinishi.
- SAT, IELTS, Milliy va Quiz reytinglar.
- Liga ko'rinishi.
- Streak va daraja vizualizatsiyasi.

## 4. Logika qanday ishlaydi

### 4.1 State boshqaruvi

Global state `src/store.ts` da saqlanadi. U quyidagilarni ushlab turadi:

- XP, level, coins.
- userRole.
- tasks, exams, habits, courses, groups.
- consultations, certificates, portfolio.
- posts, leaderboard, events.
- gameProfile, achievements, questDefs, titleDefs.
- UI state: theme, sidebar, modal, notifications, confirm dialog, currentTab.

State saqlash oqimi:

- `loadState()` backenddan user state oladi.
- `saveState()` debounced tarzda backendga yozadi.
- Dark mode localStorage'da ham saqlanadi.

### 4.2 Gamification

Ilovadagi amallar `rewardAndUpdate()` orqali XP/coin beradi.

Misollar:

- test tugatish.
- kurs sotib olish.
- konsultatsiya yozish.
- post yaratish.
- pomodoro yakunlash.
- AI chat ishlatish.

### 4.3 Backend state

`server/state.ts` default state bilan ishlaydi.

- Agar user state topilmasa, default demo state qaytariladi.
- PUT `/api/state` state'ni saqlaydi.
- JSON ko'rinishda `user_state` jadvaliga yoziladi.

### 4.4 Mock data

`server/mock-data/*` quyidagi ma'lumotlarni taqdim etadi:

- IELTS mock savollari.
- SAT mock savollari.
- Milliy test savollari.
- Admin testlar.
- Competition leaderboard studentlari.

Bu modullar frontendni demo ko'rinishda jonli qiladi.

## 5. Kuchli tomonlari

- Bitta platformada ko'p funksiyani birlashtirgan.
- UI modullar ancha boy va ko'p ssenariyni qoplaydi.
- Auth, state, reward va gamification markazlashtirilgan.
- Mock data orqali demo ishga tushirish oson.
- Dark mode va responsive layout bor.
- AI integratsiya qo'shilgan.
- Portfolio, universitet va consulting kabi real value beruvchi bloklar mavjud.

## 6. Kamchiliklar

### 6.1 Xavfsizlik kamchiliklari

- Admin role register orqali ochib yuborilgan.
- JWT secret default dev qiymatda qolishi mumkin.
- Role switch frontendda bor, lekin server darajasida qat'iy enforcement ko'rinmaydi.
- Ayrim ma'lumotlar foydalanuvchi nomiga bog'langan, bu identifikatsiyada xatoga olib keladi.

### 6.2 Data integrity muammolari

- Guruh a'zoligi `user.id` emas, `user.name` ga bog'langan.
- Ba'zi chat/post holatlari faqat lokal state'da yuradi.
- O'qituvchi va admin amallari hamma joyda alohida permission bilan himoyalanmagan.
- Bir xil ismli foydalanuvchilar bir-biriga aralashib ketishi mumkin.

### 6.3 Accessibility muammolari

- Ayrim interaktiv elementlar keyboard uchun to'liq ishlamaydi.
- Ba'zi ikon/buttonlar semantic button emas.
- Ba'zi inputlarda `name` va `autocomplete` yo'q.
- Katta modal va dropdown'larda fokus boshqaruvi kuchsiz.
- Dynamic content uchun ayrim joylarda `aria-live` yetarli emas.

### 6.4 UX / product kamchiliklari

- Ko'p content demo va placeholder xususiyatda.
- Ayrim ekranlarda real backend bilan sinxronlash to'liq emas.
- Foydalanuvchi nomlari va tarixlar hardcoded.
- Sana formatlari hardcoded.
- Ba'zi bo'limlarda real CRUD emas, faqat visual simulyatsiya bor.

### 6.5 Performance va maintainability

- `saveState()` ko'p state change bo'lganda tez-tez chaqiriladi.
- Katta monolit komponentlar mavjud.
- Dinamik Tailwind class'lar build vaqtida o'tkazib yuborilishi mumkin.
- Bir xil logika turli komponentlarda takrorlangan.
- Mock data va production data aralashib ketgan.

## 7. Ustuvor yangilashlar

### 7.1 Majburiy

- Admin role'ni register'dan olib tashlash.
- JWT secret'ni qat'iy environment variable qilish.
- Role permission'larni backendda tekshirish.
- Guruh, chat va profile identifikatsiyasini `user.id` ga o'tkazish.
- Notification va menu interaksiyalarini keyboard-friendly qilish.

### 7.2 Tavsiya etiladi

- State persistence uchun schema va migration qatlamini ajratish.
- Mock data va real data uchun alohida servislar yaratish.
- Form validation'ni kuchaytirish.
- Date/number formatlarni `Intl.*` bilan chiqarish.
- Dynamic Tailwind class'larni static mapping bilan almashtirish.
- Local-only chat/post funksiyalarini backendga ko'chirish.

### 7.3 Produktni kuchaytirish uchun

- Real notifications realtime oqimi.
- Real analytics dashboard.
- Teacher/admin uchun haqiqiy CRUD.
- File upload va sertifikat yuklash.
- Guruh chat uchun persistent message history.
- Portfolio export ni PDF/HTML generator bilan yaxshilash.
- AI coach uchun prompt history va session management.

## 8. Qisqa xulosa

LifeSprint hozirgi holatda juda keng funksiyali education ecosystem:

- o'qish,
- test,
- kurs,
- community,
- AI,
- consulting,
- portfolio,
- gamification.

Lekin platformaning eng muhim muammolari:

- admin/security qatlamining sustligi;
- bir qator funksiyalarning faqat visual demo bo'lib qolganligi;
- identity va state bog'lanishining noto'g'ri qurilgani;
- accessibility va maintainability bo'yicha bo'shliqlar.

Bu loyiha konsept jihatdan kuchli, ammo production darajasiga chiqishi uchun avvalo xavfsizlik, data model va persistence qatlamlarini qayta tartibga solish kerak.
