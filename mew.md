# LifeSprint Yangi Product G'oyalari

Ushbu hujjat ilovaning yangi yo'nalishini tartiblaydi. Maqsad:

- chap sidebar va asosiy boshqaruv panelini saqlash;
- o'quvchi oqimini aniqroq qilish;
- kurs, guruh, test, game va premium qismlarini ajratish;
- o'qituvchi, o'quvchi va tizim logikasini aniq bo'limlarga bo'lish.

## 1. Asosiy navigatsiya

- Chap tarafdagi sidebar qoladi.
- Boshqaruv paneli asosiy markaz bo'lib qoladi.
- Dashboard ichki bosh sahifa sifatida qoladi.
- Layout o'zgarmaydi, faqat bo'limlar qayta tartiblanadi.

## 2. O'quvchi bo'limi

### 2.1 Akademik darslar

- Hozirgi "Akademik darslar" nomi alohida asosiy menyu bo'lib qolmaydi.
- Akademik darslar kurs sifatida ko'rinadi.
- Bu kurslar o'qituvchilar tomonidan yuklanadigan pullik kurslar sifatida ishlaydi.
- Kurslar sotib olinmaguncha faqat vizitka ko'rinishida bo'ladi.

### 2.2 Test Markazi

- Testlar alohida bo'lim bo'lib qoladi.
- Test Markazi asosiy o'quvchi ishlari uchun alohida markaz bo'ladi.
- Bu yerda SAT, IELTS, milliy va mavzuga bog'langan testlar bo'ladi.

### 2.3 Xorijiy sertifikatlar

- Xorijiy sertifikatlar alohida bo'limga chiqariladi.
- Grantlar, xalqaro sertifikatlar va ariza tayyorlash qismlari shu yerda jamlanadi.

### 2.4 Mening Guruhlarim

- O'quvchi uchun alohida "Mening Guruhlarim" bo'limi qo'shiladi.
- O'quvchi kurs uchun to'lov qiladi va keyin guruhga qo'shiladi.
- Guruhni to'liq o'qituvchi boshqaradi.
- Guruhdagi a'zolar sonini o'qituvchi belgilaydi.
- O'qituvchi kim kirishini, kim chiqarilishini va guruh tarkibini nazorat qiladi.

Guruh ichida quyidagilar bo'ladi:

- jonli darslar sanasi;
- dars vaqti;
- darsda o'tiladigan mavzular haqida qisqacha ma'lumot;
- dars kuzatish uchun alohida blok;
- uy vazifalari;
- reyting;
- guruhdoshlar o'rtasidagi o'zaro holat;
- ustoz yuborgan e'lonlar.

## 3. Guruh logikasi

Guruh tizimi quyidagicha ishlaydi:

1. O'quvchi kurs uchun to'lov qiladi.
2. To'lov tasdiqlanadi.
3. O'qituvchi o'quvchini guruhga qabul qiladi.
4. O'quvchi guruh a'zosi bo'ladi.
5. Guruh o'quvchining "Mening Guruhlarim" qismida ko'rinadi.
6. Jonli darslar, vazifalar va reytinglar shu yerda kuzatiladi.

Har bir guruhda quyidagi ma'lumotlar bo'lishi kerak:

- guruh nomi;
- kurs nomi;
- ustoz nomi;
- guruh sig'imi;
- guruh a'zolari limiti;
- jonli darslar jadvali;
- dars mazmuni;
- uy vazifasi;
- materiallar;
- chat yoki xabarlar;
- progress.

## 4. O'qituvchi logikasi

O'qituvchi tomonidan:

- kurs yuklanadi;
- kurs vizitka ko'rinishida chiqadi;
- kurs narxi belgilanadi;
- guruhga o'quvchi qabul qilinadi;
- uy vazifasi yuboriladi;
- guruh e'lonlari chiqariladi.

### To'lov jarayoni

- O'quvchi kursni sotib oladi.
- Agar kurs narxi, masalan, to'lov amalga oshiriladi.
- To'lovdan so'ng o'qituvchiga bildirishnoma yoki SMS ketadi.
- O'qituvchi shu o'quvchini guruhga qo'shadi.
- Guruh sig'imi to'lsa, o'qituvchi yangi a'zo qo'sha olmaydi.
- So'ng o'quvchi guruh bo'limida ko'rinadi.

### O'qituvchi boshqaruvi

- Guruh sig'imini o'qituvchi belgilaydi.
- Guruhdagi o'quvchilar ro'yxati o'qituvchi tomonidan boshqariladi.
- O'qituvchi xohlagan o'quvchini qabul qiladi yoki chiqaradi.
- Darslar, uy vazifalari va e'lonlar ham o'qituvchi tomonidan nazorat qilinadi.

## 5. O'yin zonasi

Hozirgi o'yin zonasi qayta nomlanadi va ikki asosiy tizimga bo'linadi.(Game kerak juda ko'p)

### 5.1 EduBattle

- O'quvchi o'z mavzulari bo'yicha tengqurlar bilan raqobat qiladi.
- Musobaqa individual bo'ladi.
- Har bir mavzu yoki o'tilgan qism uchun reyting bo'ladi.
- G'oliblar, duel natijalari va reaktsiyalar chiqadi.
- Chempionat va turnir tizimi bo'ladi.

### 5.2 EduJamoa

- O'quvchilar jamoa yaratadi.
- Bir jamoada maksimal 6 ta o'quvchi bo'lishi mumkin.
- Jamoalar o'zaro raqobat qiladi.
- Liga tizimi bo'ladi:
  - bronza;
  - kumush;
  - oltin;
  - yuqori bosqichlar.
- Jamoaviy reytinglar alohida yuritiladi.

## 6. Pandoo AI logikasi

Pandoo AI test va o'qish oqimining yordamchi qismi bo'ladi.

Qoidalar:

- Agar o'quvchi yoki o'qituvchi o'zi kirgan testda 50% dan past natija olsa, Pandoo AI aralashadi.
- Pandoo AI xatolarni qisqacha tushuntiradi.
- Keyin mavzuni qayta, sodda va to'liq tushuntiradi.
- Shundan so'ng yangi test yoki mini-test chiqaradi.
- Test mavzuga mos bo'lishi kerak.
- O'quvchi kiritgan mavzu bo'yicha qisqa o'yinli test ham tuzib berilishi kerak.

## 7. Kurslar va premium do'kon

### 7.1 Kurslar

- Darslar o'qituvchilarning vizitka kartasi ko'rinishida chiqadi.
- Har bir karta ustida kurs nomi, ustoz, qisqacha tavsif, narx va reyting bo'ladi.
- Karta bosilganda detail sahifa ochiladi.
- Sotib olish jarayoni sodda va tushunarli bo'ladi.

### 7.2 Premium do'kon

Kurslar bo'limidan keyin alohida premium do'kon qo'shiladi.

Bu do'konda:

- profil ramkalari;
- turli icon packlar;
- shrift uslublari;
- badge va cosmetic elementlar;
- o'yin uchun bonus buyumlar;
- dizayn bezaklari sotiladi.

### 7.3 Intizom bo'limi

- Intizom bo'limi tekin qoladi.
- U premium bilan bog'lanmaydi.
- Intizom tracker kuchliroq, tahliliy va imkon bo'lsa 3D ko'rinishda bo'lishi mumkin.

## 8. Yillik xulosa

Premium foydalanuvchi yoki yil yakunida platforma quyidagi xulosalarni chiqaradi:

- nechta XP yig'ilgan;
- nechta sertifikat olingan;
- nechta marta yutgan;
- nechta jamoaviy liga yutug'i bor;
- nechta kurs tugatilgan;
- qaysi yo'nalishlarda kuchli;
- 5-6 ta asosiy kompetensiya bo'yicha baho.

## 9. Konsultatsiya va universitet qismi

- Konsultatsiya alohida bo'lim bo'lib qoladi.
- O'quvchi o'z profil ma'lumotlarini kirita oladi.
- Platforma universitetlarni butun dunyo bazalaridan topishga harakat qiladi.
- Grantlar, talablari, IELTS/SAT/GPA va boshqa filtrlar bilan ishlaydi.
- Bu qism o'z mohiyatini yo'qotmasdan saqlanadi.

## 10. Yakuniy prinsip

Platforma quyidagicha bo'lishi kerak:

- boshqaruv paneli saqlansin;
- test markazi alohida bo'lsin;
- sertifikatlar alohida bo'lsin;
- guruhlar kuchli va markaziy bo'lsin;
- o'yin zonasi EduBattle va EduJamoaga o'tsin;
- AI yordamchi xato topib qayta o'qitsin;
- premium do'kon bo'lsin;
- intizom bepul va kuchli bo'lib qolsin;
- konsultatsiya va universitet qismi to'liq saqlansin.
