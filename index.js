// index.js - Telegram Oyun Botu (3 Oyun) - Render Uyumlu
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// =====================================================
//  RENDER UYKU MODUNU ENGELLE (Web Sunucusu)
// =====================================================
const app = express();
app.get('/', (req, res) => res.send('🎮 Oyun Botu Aktif!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Web sunucusu ${PORT} portunda çalışıyor.`));

// =====================================================
//  TELEGRAM BOTU
// =====================================================
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("❌ TELEGRAM_TOKEN .env dosyasında veya Render Environment'ta bulunamadı!");
  process.exit(1);
}
const bot = new TelegramBot(token, { polling: true });

// =====================================================
//  OYUN DURUMLARI (chatId bazlı)
// =====================================================
const isimSehirOyunlari = {};      // chatId -> oyun objesi
const adamAsmacaOyunlari = {};     // chatId -> oyun objesi

// =====================================================
//  DOĞRULUK SORULARI (100 Adet)
// =====================================================
const dogrulukSorulari = [
  // ---- Klasik / Eğlenceli (1-20) ----
  "Hayatında yediğin en garip yemek neydi?",
  "Eğer bir süper gücün olsaydı ne olurdu?",
  "Bir gün için bir ünlüye dönüşebilsen kim olurdun?",
  "Hiç kimsenin bilmediği gizli bir yeteneğin var mı?",
  "Sabah mı gece mi, hangisi sana daha çok yakışıyor?",
  "Dünyada yaşamak istediğin en uzak yer neresi?",
  "Zombi kıyametinde ilk işin ne olurdu?",
  "En sevdiğin film hangisi ve neden?",
  "Bir hayvana dönüşebilsen hangisi olurdun?",
  "Hayatının soundtrack'i olsa ilk hangi şarkı çalardı?",
  "En utandığın an neydi?",
  "Birinin seni en çok güldüren hareketi neydi?",
  "Hiç ünlü biriyle tanıştın mı, kimdi?",
  "Bir günlük kendi evrenini yönetebilsen ilk neyi değiştirirdin?",
  "Hangi tatlı sana kendini hep iyi hissettirir?",
  "Ev aletlerinden hangisini hiç sevmiyorsun?",
  "Çocukluğunun en sevdiğin oyunu neydi?",
  "Şu an hayatında dokunmak istediğin bir tuşa basabilsen ne olurdu?",
  "Bir gün boyunca sadece bir kelime kullanabilsen hangisini seçerdin?",
  "Hiç ilginç bir rüya gördün mü, anlatır mısın?",

  // ---- Derin ve Duygusal (21-40) ----
  "Hayatında seni en çok gururlandıran an hangisi?",
  "Bana en çok neden aşık oldun?",
  "Hayatında en çok neyden korkuyorsun?",
  "Mutlu olmak için sana en çok ne gerekiyor?",
  "Çocukken büyüyünce ne olmak istiyordun?",
  "Hangi anıyı tekrar yaşayabilsen seçerdin?",
  "Sana en çok güven veren şey nedir?",
  "Hayatında unutamadığın bir sözü var mı?",
  "Sence sevgi nedir?",
  "Bir insanda en çok neyi takdir edersin?",
  "Ailenle en güzel hatıran nedir?",
  "Hiç bir şeyi çok özlediğin oldu mu?",
  "Kendini en iyi hangi anda hissettin?",
  "Hayatında değiştirmek istediğin bir alışkanlığın var mı?",
  "Bir gün hiç yapmadığın bir şeyi yapsan ne olur?",
  "Seni hayata bağlayan üç şey nedir?",
  "En çok kimden etkilendin?",
  "Bir insanın sana söylediği en güzel söz neydi?",
  "Kendinde en beğendiğin özellik nedir?",
  "İlişkimizde en çok neyi seviyorsun?",

  // ---- Romantik (41-60) ----
  "İlk görüşte beni nasıl bulmuştun?",
  "Sana en romantik gelen hareket nedir?",
  "Birlikte gitmek istediğin ilk yer neresi?",
  "Benim hangi huyumu en çok seviyorsun?",
  "Bir gün boyunca sadece bana ait olsan nasıl geçerdi?",
  "Sana sürpriz yapılsa en çok hangisi hoşuna gider?",
  "Birlikte izlemek istediğin bir dizi var mı?",
  "Hayatında unutamadığın bir öpücük anı var mı?",
  "Beni en çok neyle mutlu edersin sence?",
  "Birlikte yapmak istediğin bir macera nedir?",
  "Sence en iyi sevgi dili nedir?",
  "Bir gece yarısı bana ne söylemek istersin?",
  "Hangi şarkı bizi temsil ediyor sence?",
  "Birlikte kurmak istediğin küçük bir gelenek var mı?",
  "Ne zaman kendini en çok bana yakın hissediyorsun?",
  "Sana bir mektup yazsam ilk cümlem ne olsun?",
  "Birlikte geçirdiğimiz en güzel gün hangisi?",
  "Hangi dış mekânda öpüşmek isterdin?",
  "Seni en çok ne zaman hayran bıraktım?",
  "Yakında yapmak istediğin küçük bir romantik plan var mı?",

  // ---- Geçmiş ve İlişkiler (61-75) ----
  "Önceki ilişkinden en çok ne öğrendin?",
  "Bir ilişkide senin için olmazsa olmaz şey nedir?",
  "En çok hangi konuda kıskanırsın?",
  "Kıskançlık sana neyi hissettirir?",
  "Bir ilişkide tartışınca nasıl barışmayı seversin?",
  "Eski bir sevgilin hakkında merak ettiğin bir şey var mı?",
  "Bir kişi hakkında bilmeden ilk izlenim ne olur?",
  "Bizim ilişkimizde değiştirmek istediğin bir şey var mı?",
  "İlişkimizde seni en çok ne rahatlatıyor?",
  "Partnerinden en çok hangi davranışı beklersin?",
  "Sana en çok hangi konuda kendini ifade etmek zor geliyor?",
  "Bir sır paylaşabilsen hangisini paylaşırdın?",
  "Hayatında hiç yalan söylemek zorunda kaldın mı?",
  "Bir insanı affetmek senin için ne kadar zor?",
  "Benimle ilgili bilmediğin bir şeyi merak ediyor musun?",

  // ---- Hayaller ve Gelecek (76-85) ----
  "Beş yıl sonra kendini nerede görüyorsun?",
  "Hayalindeki ev nasıl bir ev?",
  "Birlikte bir ülkeye taşınabilsek hangisi olurdu?",
  "Hayatını bir kitap olarak yazsan adı ne olurdu?",
  "En büyük hayalin nedir?",
  "Hayatında yapmak istediğin ama henüz yapmadığın bir şey var mı?",
  "Çocuk sahibi olmak hakkında ne düşünüyorsun?",
  "Emekli olduğunda nasıl bir hayat yaşamak isterdin?",
  "Birlikte bir proje yapsak ne olurdu?",
  "Yaşlandığımızda birlikte nasıl bir yerde olmak isterdik?",

  // ---- Yetişkin Temalı (86-100) ----
  "Seni en çok heyecanlandıran dokunuş hangisi?",
  "Birlikte denemek istediğin bir fikir var mı?",
  "Rahatlıkla konuşabildiğin bir cinsel tercihin var mı?",
  "Bu konuda kendini en rahat hissettiğin ortam hangisi?",
  "Bir ilişkide yakınlığın senin için ne ifade ediyor?",
  "Hangi duygusal ya da fiziksel ihtiyacın bence yeterince karşılanmıyor?",
  "Birlikte geçirmek istediğin ideal bir gece nasıl olurdu?",
  "Sana en çok hangi ortam ve atmosfer iyi gelir?",
  "Hangi konuda daha cesur olmak istersin?",
  "Yatakta sana en çok neyin iyi geldiğini bilmek ister miydin?",
  "Bir fantezin olsa, bunu bana anlatmak ister misin?",
  "Konuşmak istemediğin bir konu var mı?",
  "Kendi bedeninde en çok hangi kısmını seviyorsun?",
  "Sence iyi bir öpücüğün sırrı nedir?",
  "Birlikte bu sorulardan hangisi üzerine daha uzun konuşmak isterdin?"
];

// =====================================================
//  CESARETLİK SORULARI (50 Adet)
// =====================================================
const cesaretlikSorulari = [
  // ---- Klasik / Eğlenceli (1-17) ----
  "Yanındakinin telefonunu al ve 30 saniye boyunca kimseye mesaj atmadan elinde tut.",
  "Bir şarkıyı, sadece nakaratını rap tarzında oku.",
  "En yakın pencereden dışarıya dönüp bir kişiye selam ver.",
  "Şu an yüzünde en komik ifadeyi yap ve 10 saniye tut.",
  "Elindeki bir eşyayı ağzında taşıyarak odada bir tur at.",
  "Bir hayvan sesi çıkararak en sevdiğin yemeği anlat.",
  "Yanındakine bir dakika boyunca dans ettir.",
  "Bir ünlünün taklidini yap, karşındaki tahmin etsin.",
  "Telefonundaki son fotoğrafı yüksek sesle açıkla.",
  "Gözlerini kapatıp yanındakinin yüzünü dokunarak tahmin etmeye çalış.",
  "En son yaptığın sahte iddia ne ise itiraf et.",
  "Bir dakika boyunca sadece fısıldayarak konuş.",
  "Yanındakinin en sevdiğin kıyafetini bir dakika üzerinde taşı.",
  "Bir kişinin bilmediğin bir hobisini tahmin et.",
  "Şimdiye kadar aldığın en garip hediyeyi anlat.",
  "En sevdiğin çocukluk şarkısını ninni gibi söyle.",
  "Odadaki birine iltifat et, ama sadece kelimelerle değil taklit ederek.",

  // ---- Orta Seviye Cesaret (18-34) ----
  "Yanındakine en sevdiğin üç özelliğini sesli söyle.",
  "Son bir ay içinde ağladığın bir an varsa anlat.",
  "Yanındakine bir masaj 1 dakika boyunca yap.",
  "En son yaptığın utanç verici şeyi itiraf et.",
  "Karşındakinin hangi huyunu en çok sevdiğini tahmin et ve söyle.",
  "Yanındakinin kulağına bir sır fısılda, sadece onun duyabileceği kadar.",
  "Bir dakika boyunca gözlerinin içine bakarak konuş, gülmeden.",
  "Sosyal medyada en son ne zaman bir fotoğrafına beğeni attığını söyle.",
  "Yanındakini kucakla ve 10 saniye sarılı kal.",
  "En kötü ilk izlenimini anlat ve neden yanıldığını açıkla.",
  "Hayatında hiç birine söylemediğin bir itirafı paylaş.",
  "Bir dakika boyunca karşındakinin ellerini tutarak sessiz kal.",
  "En çok kıskandığın şeyi söyle.",
  "Yanındakinin telefonunu 30 saniye boyunca açıp en son fotoğrafına bak ve yorum yap.",
  "Yanındakine ne zaman en çok sevgi hissettiğini anlat.",
  "Hayatının en utanç verici rüyasını anlat.",
  "Yanındakinin üzerindeki bir aksesuarı alıp 1 dakika kendinde tut.",

  // ---- Cesur ve Romantik (35-50) ----
  "Yanındakinin yanağına kısa bir öpücük ver.",
  "Karşındakinin boynuna ellerini koyup bir dakika sessiz kal.",
  "Yanındakine en romantik bulduğun cümleyi fısılda.",
  "Yanındakinin ellerini tutup gözlerine 30 saniye bak.",
  "Karşındakinin kulağına bir iltifat fısılda.",
  "Yanındakini kucakla ve kulağına sevdiğin bir şarkının bir dizesini söyle.",
  "Yanındakini elinden tutup odada bir tur attır.",
  "Karşındakine bir tane sarılma hediye et, 20 saniye süren.",
  "Yanındakinin omzuna başını yasla ve 1 dakika öyle kal.",
  "Yanındakinin ellerini ellerinle sar ve ona bir anını anlat.",
  "Karşındakine bir öpücük hayal etmesi için bir cümle kur.",
  "Yanındakine en çok hoşlandığın fiziksel özelliğini söyle.",
  "Karşındakinin yüzünü iki elinle tutup gözlerine bak.",
  "Yanındakinin kulağına en güzel anını fısılda.",
  "Karşındakine bir gece için ne istediğini tek cümleyle söyle.",
  "Yanındakinin yanağına kısa bir öpücük verip \"bu da seninle ilgili\" de."
];

// =====================================================
//  ADAM ASMACA KELİME HAVUZU
// =====================================================
const adamAsmacaKelimeleri = [
  "KELEBEK", "BİLGİSAYAR", "TELEFON", "İSTANBUL", "KARPUZ",
  "ÖĞRETMEN", "DENİZ", "YILDIZ", "KİTAP", "ÇİÇEK",
  "BULUT", "GÖKYÜZÜ", "MUTLULUK", "ARKADAŞ", "OKYANUS",
  "PENCERE", "KEÇİ", "SAAT", "PORTAKAL", "MÜZİK",
  "TÜRKİYE", "ANADOLU", "KAHVE", "BALIK", "KEDİ"
];

// =====================================================
//  YARDIMCI FONKSİYONLAR
// =====================================================
function rastgeleEleman(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const turkceBuyuk = (s) => s.toLocaleUpperCase('tr-TR');

// =====================================================
//  /start KOMUTU - ANA MENÜ
// =====================================================
bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;

  const klavye = {
    inline_keyboard: [
      [{ text: "1️⃣ İsim-Şehir Oyunu", callback_data: "oyun_isimsehir" }],
      [{ text: "2️⃣ Doğruluk-Cesaretlik", callback_data: "oyun_dogruluk" }],
      [{ text: "3️⃣ Adam Asmaca", callback_data: "oyun_adamasmaca" }]
    ]
  };

  bot.sendMessage(chatId,
    "🎮 **Oyun Botuna Hoş Geldin!**\n\n" +
    "Hangi oyunu oynamak istiyorsun?\n\n" +
    "1️⃣ **İsim-Şehir** (2 dakika)\n" +
    "2️⃣ **Doğruluk-Cesaretlik** (rastgele sorular)\n" +
    "3️⃣ **Adam Asmaca** (kelime tahmin)",
    { parse_mode: 'Markdown', reply_markup: klavye });
});

// =====================================================
//  /start isimsehir KOMUTU
// =====================================================
bot.onText(/^\/start\s+isimsehir$/i, (msg) => {
  isimsehirBaslat(msg.chat.id);
});

// =====================================================
//  CALLBACK QUERY YÖNLENDİRİCİ
// =====================================================
bot.on('callback_query', async (cq) => {
  const chatId = cq.message.chat.id;
  const data = cq.data;

  bot.answerCallbackQuery(cq.id).catch(() => {});

  // Ana menü seçimleri
  if (data === 'oyun_isimsehir') { isimsehirBaslat(chatId); return; }
  if (data === 'oyun_dogruluk')  { dogrulukMenu(chatId);   return; }
  if (data === 'oyun_adamasmaca'){ adamAsmacaBaslat(chatId); return; }

  // İsim-Şehir harf seçimi
  if (data.startsWith('is_harf_')) {
    isimsehirHarfSec(chatId, data.split('_')[2]);
    return;
  }

  // Doğruluk / Cesaretlik
  if (data === 'dc_dogruluk') { dogrulukSoruGonder(chatId); return; }
  if (data === 'dc_cesaret')  { cesaretlikSoruGonder(chatId); return; }

  // Adam Asmaca
  if (data.startsWith('aa_harf_')) {
    adamAsmacaTahmin(chatId, data.split('_')[2]);
    return;
  }
  if (data === 'aa_yeniden') { adamAsmacaBaslat(chatId); return; }
  if (data === 'aa_bos') return;
});

// =====================================================
//  1. OYUN: İSİM-ŞEHİR
// =====================================================
function isimsehirBaslat(chatId) {
  if (isimSehirOyunlari[chatId]) {
    bot.sendMessage(chatId, "⚠️ Bu sohbette zaten devam eden bir İsim-Şehir oyunu var!");
    return;
  }

  isimSehirOyunlari[chatId] = { aktif: false, bitisZamani: null };

  const harfler = ['A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I', 'İ',
                   'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş',
                   'T', 'U', 'Ü', 'V', 'Y', 'Z'];

  const satirlar = [];
  let satir = [];
  harfler.forEach((h, i) => {
    satir.push({ text: h, callback_data: `is_harf_${h}` });
    if (satir.length === 7 || i === harfler.length - 1) {
      satirlar.push(satir);
      satir = [];
    }
  });

  bot.sendMessage(chatId,
    "📝 **İSİM-ŞEHİR OYUNU**\n\n" +
    "📌 Kurallar:\n" +
    "• Bir harf seçin.\n" +
    "• Bot size 5 kategori gönderecek.\n" +
    "• 2 dakika içinde her kategoriye o harfle başlayan bir kelime yazın.\n" +
    "• Herkes aynı anda yazabilir.\n\n" +
    "**Başlamak için bir harf seç:**",
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: satirlar } });
}

function isimsehirHarfSec(chatId, harf) {
  const oyun = isimSehirOyunlari[chatId];
  if (!oyun) {
    bot.sendMessage(chatId, "Önce /start isimsehir yazarak oyunu başlatın.");
    return;
  }
  if (oyun.aktif) {
    bot.sendMessage(chatId, "⚠️ Oyun zaten devam ediyor! Bitişi bekleyin.");
    return;
  }

  oyun.aktif = true;
  oyun.harf = harf;
  oyun.bitisZamani = Date.now() + 2 * 60 * 1000;
  oyun.mesajlar = [];

  const kategoriler = ["İSİM", "ŞEHİR", "HAYVAN", "MEYVE/SEBZE", "EŞYA"];

  bot.sendMessage(chatId,
    `🎯 **Oyun Başladı!**\n\n` +
    `🔤 Harf: **${harf}**\n` +
    `⏱ Süre: **2 dakika**\n\n` +
    `Şu kategorilere **${harf}** harfiyle başlayan kelimeler yazın:\n\n` +
    kategoriler.map((k, i) => `${i + 1}. ${k}`).join('\n') +
    `\n\n✍️ Herkes serbestçe yazsın! Süre bitince bot mesajları toplayacak.`,
    { parse_mode: 'Markdown' });

  oyun.dinleyici = (msg) => {
    if (msg.chat.id !== chatId) return;
    if (!oyun.aktif) return;
    if (Date.now() > oyun.bitisZamani) return;
    if (!msg.text || msg.text.startsWith('/')) return;

    oyun.mesajlar.push({
      kullanici: msg.from.first_name || msg.from.username || 'Anonim',
      metin: msg.text
    });
  };
  bot.on('message', oyun.dinleyici);

  oyun.zamanlayici = setTimeout(() => isimsehirBitir(chatId), 2 * 60 * 1000);
}

function isimsehirBitir(chatId) {
  const oyun = isimSehirOyunlari[chatId];
  if (!oyun) return;

  oyun.aktif = false;
  if (oyun.dinleyici) bot.removeListener('message', oyun.dinleyici);

  const mesajlar = oyun.mesajlar || [];

  if (mesajlar.length === 0) {
    bot.sendMessage(chatId,
      `⏰ **Süre doldu!**\n\nKimse cevap yazmadı. 😔\n\nYeniden oynamak için /start isimsehir yazın.`,
      { parse_mode: 'Markdown' });
    delete isimSehirOyunlari[chatId];
    return;
  }

  let rapor = `⏰ **Süre doldu! İşte cevaplar:**\n\n🔤 Harf: **${oyun.harf}**\n\n`;
  mesajlar.forEach((m, i) => {
    rapor += `${i + 1}. **${m.kullanici}:** ${m.metin}\n`;
  });
  rapor += `\n🎉 Tebrikler! Yeniden oynamak için /start isimsehir yazın.`;

  bot.sendMessage(chatId, rapor, { parse_mode: 'Markdown' });
  delete isimSehirOyunlari[chatId];
}

// =====================================================
//  2. OYUN: DOĞRULUK - CESARETLİK
// =====================================================
function dogrulukMenu(chatId) {
  bot.sendMessage(chatId,
    "🎭 **DOĞRULUK - CESARETLİK**\n\nHangisini seçiyorsun?\n\n" +
    `🗣 Doğruluk: **${dogrulukSorulari.length} soru**\n` +
    `🔥 Cesaretlik: **${cesaretlikSorulari.length} soru**`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🗣 Doğruluk", callback_data: "dc_dogruluk" }],
          [{ text: "🔥 Cesaretlik", callback_data: "dc_cesaret" }]
        ]
      }
    });
}

function dogrulukSoruGonder(chatId) {
  if (dogrulukSorulari.length === 0) {
    bot.sendMessage(chatId, "⚠️ Henüz doğruluk sorusu eklenmedi!");
    return;
  }
  const soru = rastgeleEleman(dogrulukSorulari);
  bot.sendMessage(chatId,
    `🗣 **DOĞRULUK**\n\n${soru}\n\n_Cevaplamak için sohbete yazın._`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🗣 Başka Doğruluk", callback_data: "dc_dogruluk" }],
          [{ text: "🔥 Cesaretlik", callback_data: "dc_cesaret" }]
        ]
      }
    });
}

function cesaretlikSoruGonder(chatId) {
  if (cesaretlikSorulari.length === 0) {
    bot.sendMessage(chatId, "⚠️ Henüz cesaretlik sorusu eklenmedi!");
    return;
  }
  const soru = rastgeleEleman(cesaretlikSorulari);
  bot.sendMessage(chatId,
    `🔥 **CESARETLİK**\n\n${soru}\n\n_Yapmak zorundasın! 😈_`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔥 Başka Cesaretlik", callback_data: "dc_cesaret" }],
          [{ text: "🗣 Doğruluk", callback_data: "dc_dogruluk" }]
        ]
      }
    });
}

// =====================================================
//  3. OYUN: ADAM ASMACA
// =====================================================
function adamAsmacaBaslat(chatId) {
  if (adamAsmacaOyunlari[chatId]) {
    bot.sendMessage(chatId, "⚠️ Bu sohbette zaten devam eden bir Adam Asmaca oyunu var!");
    return;
  }

  const kelime = turkceBuyuk(rastgeleEleman(adamAsmacaKelimeleri));
  const oyun = {
    kelime: kelime,
    tahminler: new Set(),
    yanlisSayisi: 0,
    maxYanlis: 6
  };
  adamAsmacaOyunlari[chatId] = oyun;

  bot.sendMessage(chatId,
    "🎯 **ADAM ASMACA OYUNU BAŞLADI!**\n\n" +
    "Kelimeyi tahmin etmek için harf butonlarına basın.\n" +
    "6 yanlış hakkınız var!",
    { parse_mode: 'Markdown' });

  adamAsmacaGuncelle(chatId);
}

function adamAsmacaDurum(oyun) {
  let gosterim = '';
  for (const harf of oyun.kelime) {
    if (harf === ' ') gosterim += '  ';
    else if (oyun.tahminler.has(harf)) gosterim += harf + ' ';
    else gosterim += '_ ';
  }
  return gosterim.trim();
}

function adamAsmacaTahta(oyun) {
  const yanlis = oyun.yanlisSayisi;
  const tahtalar = [
    "```\n  +---+\n      |\n      |\n      |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n      |\n      |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n  |   |\n      |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n /|   |\n      |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n /|\\  |\n      |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n /|\\  |\n /    |\n      |\n      |\n=========```",
    "```\n  +---+\n  O   |\n /|\\  |\n / \\  |\n      |\n      |\n=========```"
  ];
  return tahtalar[Math.min(yanlis, 6)];
}

function adamAsmacaGuncelle(chatId) {
  const oyun = adamAsmacaOyunlari[chatId];
  if (!oyun) return;

  const kazandi = [...oyun.kelime].every(c => c === ' ' || oyun.tahminler.has(c));
  if (kazandi) {
    bot.sendMessage(chatId,
      `🎉 **KAZANDINIZ!**\n\nKelime: **${oyun.kelime}**\n\nYeniden oynamak için butona basın.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: "🔄 Yeniden Oyna", callback_data: "aa_yeniden" }]]
        }
      });
    delete adamAsmacaOyunlari[chatId];
    return;
  }

  if (oyun.yanlisSayisi >= oyun.maxYanlis) {
    bot.sendMessage(chatId,
      `💀 **KAYBETTİNİZ!**\n\nKelime: **${oyun.kelime}**\n\nYeniden deneyin!`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{ text: "🔄 Yeniden Oyna", callback_data: "aa_yeniden" }]]
        }
      });
    delete adamAsmacaOyunlari[chatId];
    return;
  }

  const alfabe = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
  const satirlar = [];
  let satir = [];
  [...alfabe].forEach((h, i) => {
    const tahminEdildi = oyun.tahminler.has(h);
    satir.push({
      text: tahminEdildi ? `✅${h}` : h,
      callback_data: tahminEdildi ? "aa_bos" : `aa_harf_${h}`
    });
    if (satir.length === 7 || i === alfabe.length - 1) {
      satirlar.push(satir);
      satir = [];
    }
  });

  const yanlisHarfler = [...oyun.tahminler].filter(h => !oyun.kelime.includes(h));

  const mesaj =
    `${adamAsmacaTahta(oyun)}\n\n` +
    `📝 Kelime: **${adamAsmacaDurum(oyun)}**\n\n` +
    `❤️ Kalan hak: **${oyun.maxYanlis - oyun.yanlisSayisi}**\n` +
    `❌ Yanlış harfler: ${yanlisHarfler.length ? yanlisHarfler.join(', ') : 'yok'}`;

  bot.sendMessage(chatId, mesaj, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: satirlar }
  });
}

function adamAsmacaTahmin(chatId, harf) {
  const oyun = adamAsmacaOyunlari[chatId];
  if (!oyun) {
    bot.sendMessage(chatId, "Oyun bulunamadı. /start yazarak yeniden başlatın.");
    return;
  }
  if (oyun.tahminler.has(harf)) return;

  oyun.tahminler.add(harf);
  if (!oyun.kelime.includes(harf)) oyun.yanlisSayisi++;

  adamAsmacaGuncelle(chatId);
}

// =====================================================
//  HATA YÖNETİMİ
// =====================================================
bot.on('polling_error', (err) => console.error('Polling hatası:', err.message));
bot.on('error', (err) => console.error('Bot hatası:', err.message));

console.log("🤖 Oyun botu çalışıyor...");
console.log(`📊 Doğruluk: ${dogrulukSorulari.length} soru | Cesaretlik: ${cesaretlikSorulari.length} soru`);