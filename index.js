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

  // ===== MEVCUT SORULAR (korundu) =====
  "Hayatında yediğin en garip yemek neydi?", "Eğer bir süper gücün olsaydı ne olurdu?", "Bir gün için bir ünlüye dönüşebilsen kim olurdun?", "Hiç kimsenin bilmediği gizli bir yeteneğin var mı?", "Sabah mı gece mi, hangisi sana daha çok yakışıyor?", "Dünyada yaşamak istediğin en uzak yer neresi?", "Zombi kıyametinde ilk işin ne olurdu?", "En sevdiğin film hangisi ve neden?", "Bir hayvana dönüşebilsen hangisi olurdun?", "Hayatının soundtrack'i olsa ilk hangi şarkı çalardı?", "En utandığın an neydi?", "Birinin seni en çok güldüren hareketi neydi?", "Hiç ünlü biriyle tanıştın mı, kimdi?", "Bir günlük kendi evrenini yönetebilsen ilk neyi değiştirirdin?", "Hangi tatlı sana kendini hep iyi hissettirir?", "Ev aletlerinden hangisini hiç sevmiyorsun?", "Çocukluğunun en sevdiğin oyunu neydi?", "Şu an hayatında dokunmak istediğin bir tuşa basabilsen ne olurdu?", "Bir gün boyunca sadece bir kelime kullanabilsen hangisini seçerdin?", "Hiç ilginç bir rüya gördün mü, anlatır mısın?",
  "Hayatında seni en çok gururlandıran an hangisi?", "Bana en çok neden aşık oldun?", "Hayatında en çok neyden korkuyorsun?", "Mutlu olmak için sana en çok ne gerekiyor?", "Çocukken büyüyünce ne olmak istiyordun?", "Hangi anıyı tekrar yaşayabilsen seçerdin?", "Sana en çok güven veren şey nedir?", "Hayatında unutamadığın bir sözü var mı?", "Sence sevgi nedir?", "Bir insanda en çok neyi takdir edersin?", "Ailenle en güzel hatıran nedir?", "Hiç bir şeyi çok özlediğin oldu mu?", "Kendini en iyi hangi anda hissettin?", "Hayatında değiştirmek istediğin bir alışkanlığın var mı?", "Bir gün hiç yapmadığın bir şeyi yapsan ne olur?", "Seni hayata bağlayan üç şey nedir?", "En çok kimden etkilendin?", "Bir insanın sana söylediği en güzel söz neydi?", "Kendinde en beğendiğin özellik nedir?", "İlişkimizde en çok neyi seviyorsun?",
  "İlk görüşte beni nasıl bulmuştun?", "Sana en romantik gelen hareket nedir?", "Birlikte gitmek istediğin ilk yer neresi?", "Benim hangi huyumu en çok seviyorsun?", "Bir gün boyunca sadece bana ait olsan nasıl geçerdi?", "Sana sürpriz yapılsa en çok hangisi hoşuna gider?", "Birlikte izlemek istediğin bir dizi var mı?", "Hayatında unutamadığın bir öpücük anı var mı?", "Beni en çok neyle mutlu edersin sence?", "Birlikte yapmak istediğin bir macera nedir?", "Sence en iyi sevgi dili nedir?", "Bir gece yarısı bana ne söylemek istersin?", "Hangi şarkı bizi temsil ediyor sence?", "Birlikte kurmak istediğin küçük bir gelenek var mı?", "Ne zaman kendini en çok bana yakın hissediyorsun?", "Sana bir mektup yazsam ilk cümlem ne olsun?", "Birlikte geçirdiğimiz en güzel gün hangisi?", "Hangi dış mekânda öpüşmek isterdin?", "Seni en çok ne zaman hayran bıraktım?", "Yakında yapmak istediğin küçük bir romantik plan var mı?",
  "Önceki ilişkinden en çok ne öğrendin?", "Bir ilişkide senin için olmazsa olmaz şey nedir?", "En çok hangi konuda kıskanırsın?", "Kıskançlık sana neyi hissettirir?", "Bir ilişkide tartışınca nasıl barışmayı seversin?", "Eski bir sevgilin hakkında merak ettiğin bir şey var mı?", "Bir kişi hakkında bilmeden ilk izlenim ne olur?", "Bizim ilişkimizde değiştirmek istediğin bir şey var mı?", "İlişkimizde seni en çok ne rahatlatıyor?", "Partnerinden en çok hangi davranışı beklersin?", "Sana en çok hangi konuda kendini ifade etmek zor geliyor?", "Bir sır paylaşabilsen hangisini paylaşırdın?", "Hayatında hiç yalan söylemek zorunda kaldın mı?", "Bir insanı affetmek senin için ne kadar zor?", "Benimle ilgili bilmediğin bir şeyi merak ediyor musun?",
  "Beş yıl sonra kendini nerede görüyorsun?", "Hayalindeki ev nasıl bir ev?", "Birlikte bir ülkeye taşınabilsek hangisi olurdu?", "Hayatını bir kitap olarak yazsan adı ne olurdu?", "En büyük hayalin nedir?", "Hayatında yapmak istediğin ama henüz yapmadığın bir şey var mı?", "Çocuk sahibi olmak hakkında ne düşünüyorsun?", "Emekli olduğunda nasıl bir hayat yaşamak isterdin?", "Birlikte bir proje yapsak ne olurdu?", "Yaşlandığımızda birlikte nasıl bir yerde olmak isterdik?",
  "Seni en çok heyecanlandıran dokunuş hangisi?", "Birlikte denemek istediğin bir fikir var mı?", "Rahatlıkla konuşabildiğin bir cinsel tercihin var mı?", "Bu konuda kendini en rahat hissettiğin ortam hangisi?", "Bir ilişkide yakınlığın senin için ne ifade ediyor?", "Hangi duygusal ya da fiziksel ihtiyacın bence yeterince karşılanmıyor?", "Birlikte geçirmek istediğin ideal bir gece nasıl olurdu?", "Sana en çok hangi ortam ve atmosfer iyi gelir?", "Hangi konuda daha cesur olmak istersin?", "Yatakta sana en çok neyin iyi geldiğini bilmek ister miydin?", "Bir fantezin olsa, bunu bana anlatmak ister misin?", "Konuşmak istemediğin bir konu var mı?", "Kendi bedeninde en çok hangi kısmını seviyorsun?", "Sence iyi bir öpücüğün sırrı nedir?", "Birlikte bu sorulardan hangisi üzerine daha uzun konuşmak isterdin?",

  // ===== YENİ EKLENEN 300 SORU (+18 DAHİL) =====
  // --- Cinsellik ve Mahremiyet (1-60) ---
  "İlk cinsel deneyimini kaç yaşında yaşadın?",
  "Şu ana kadar kaç kişiyle cinsel ilişkiye girdin?",
  "En uzun süreli cinsel ilişkin ne kadar sürdü?",
  "Hiç aldatıldın mı veya aldattın mı?",
  "Cinsel hayatında en çok pişman olduğun şey nedir?",
  "Hiç bir gece standı yaşadın mı?",
  "En çılgın cinsel fantezin nedir?",
  "Hiç halka açık bir yerde cinsel ilişkiye girdin mi?",
  "Cinsel yolla bulaşan bir hastalık geçirdin mi?",
  "Hiç aynı anda birden fazla kişiyle cinsel deneyim yaşadın mı?",
  "En çok hangi pozisyonu tercih ediyorsun?",
  "Hiç cinsel ilişki sırasında gülme krizine girdin mi?",
  "Cinsel ilişki sırasında hiç uyuyakaldın mı?",
  "Hiç cinsel ilişki sırasında telefonunla ilgilendin mi?",
  "En kısa cinsel ilişkin ne kadar sürdü?",
  "Hiç cinsel ilişki sırasında ağladın mı?",
  "Cinsel ilişki sırasında en çok neyden rahatsız olursun?",
  "Hiç cinsel ilişki sırasında yanlış isim söyledin mi?",
  "Hiç cinsel ilişki sırasında komik bir ses çıkardın mı?",
  "Cinsel ilişki sırasında hiç telefon çaldı mı ve açtın mı?",
  "Hiç cinsel ilişki sırasında kapı çaldı mı?",
  "En çok hangi vücut bölgesinden tahrik olursun?",
  "Hiç cinsel ilişki sırasında kramp girdi mi?",
  "Cinsel ilişki sırasında hiç düştün mü?",
  "Hiç cinsel ilişki sırasında bir şey kırdın mı?",
  "Cinsel ilişki sırasında hiç komşulardan şikayet geldi mi?",
  "Hiç cinsel ilişki sırasında polis geldi mi?",
  "Cinsel ilişki sırasında hiç ebeveynlerin bastırdı mı?",
  "Hiç cinsel ilişki sırasında fotoğraf veya video çektin mi?",
  "Hiç cinsel ilişki sırasında canlı yayın yaptın mı?",
  "Cinsel ilişki sırasında hiç telefonunla selfie çektin mi?",
  "Hiç cinsel ilişki sırasında yemek yedin mi?",
  "Cinsel ilişki sırasında hiç film izledin mi?",
  "Hiç cinsel ilişki sırasında müzik dinledin mi?",
  "Cinsel ilişki sırasında hiç oyun oynadın mı?",
  "Hiç cinsel ilişki sırasında mesajlaştın mı?",
  "Cinsel ilişki sırasında hiç iş görüşmesi yaptın mı?",
  "Hiç cinsel ilişki sırasında ders çalıştın mı?",
  "Cinsel ilişki sırasında hiç kitap okudun mu?",
  "Hiç cinsel ilişki sırasında dua ettin mi?",
  "Cinsel ilişki sırasında hiç günlük yazdın mı?",
  "Hiç cinsel ilişki sırasında alışveriş yaptın mı?",
  "Cinsel ilişki sırasında hiç banka işlemi yaptın mı?",
  "Hiç cinsel ilişki sırasında e-posta gönderdin mi?",
  "Cinsel ilişki sırasında hiç sunum hazırladın mı?",
  "Hiç cinsel ilişki sırasında toplantıya katıldın mı?",
  "Cinsel ilişki sırasında hiç araba kullandın mı?",
  "Hiç cinsel ilişki sırasında yüzdün mü?",
  "Cinsel ilişki sırasında hiç uçakta bulundun mu?",
  "Hiç cinsel ilişki sırasında trene bindin mi?",
  "Cinsel ilişki sırasında hiç otobüste bulundun mu?",
  "Hiç cinsel ilişki sırasında asansörde bulundun mu?",
  "Cinsel ilişki sırasında hiç denizde bulundun mu?",
  "Hiç cinsel ilişki sırasında ormanda bulundun mu?",
  "Cinsel ilişki sırasında hiç plajda bulundun mu?",
  "Hiç cinsel ilişki sırasında sinemada bulundun mu?",
  "Cinsel ilişki sırasında hiç tiyatroda bulundun mu?",
  "Hiç cinsel ilişki sırasında konserde bulundun mu?",
  "Cinsel ilişki sırasında hiç müzede bulundun mu?",
  "Hiç cinsel ilişki sırasında kütüphanede bulundun mu?",

  // --- İlişkiler ve Duygular (61-120) ---
  "Şu anki partnerine karşı hislerin neler?",
  "Hiç birine karşı hislerini sakladın mı?",
  "Hiç birine yalan söyleyerek onu kullandın mı?",
  "Hiç bir ilişkide fiziksel şiddet gördün mü veya uyguladın mı?",
  "Hiç bir ilişkide duygusal şiddet gördün mü veya uyguladın mı?",
  "Hiç bir ilişkide ekonomik şiddet gördün mü veya uyguladın mı?",
  "Hiç bir ilişkide cinsel şiddet gördün mü veya uyguladın mı?",
  "Hiç bir ilişkide stalkerlik yaptın mı veya maruz kaldın mı?",
  "Hiç bir ilişkide kıskançlık krizine girdin mi?",
  "Hiç bir ilişkide aşırı kıskançlık yaptın mı?",
  "Hiç bir ilişkide partnerinin telefonunu gizlice kontrol ettin mi?",
  "Hiç bir ilişkide partnerinin sosyal medyasını gizlice kontrol ettin mi?",
  "Hiç bir ilişkide partnerinin e-postasını gizlice kontrol ettin mi?",
  "Hiç bir ilişkide partnerinin günlüğünü gizlice okudun mu?",
  "Hiç bir ilişkide partnerinin çantasını gizlice karıştırdın mı?",
  "Hiç bir ilişkide partnerinin cüzdanını gizlice kontrol ettin mi?",
  "Hiç bir ilişkide partnerinin arabasını gizlice takip ettin mi?",
  "Hiç bir ilişkide partnerine gizlice GPS taktın mı?",
  "Hiç bir ilişkide partnerine gizlice kamera taktın mı?",
  "Hiç bir ilişkide partnerine gizlice mikrofon taktın mı?",
  "Hiç bir ilişkide partnerinin sosyal medya şifresini kırdın mı?",
  "Hiç bir ilişkide partnerinin telefon şifresini kırdın mı?",
  "Hiç bir ilişkide partnerinin e-posta şifresini kırdın mı?",
  "Hiç bir ilişkide partnerinin banka şifresini kırdın mı?",
  "Hiç bir ilişkide partnerinin kredi kartını gizlice kullandın mı?",
  "Hiç bir ilişkide partnerinin kimliğini gizlice kullandın mı?",
  "Hiç bir ilişkide partnerinin adına sahte hesap açtın mı?",
  "Hiç bir ilişkide partnerinin adına sahte belge düzenledin mi?",
  "Hiç bir ilişkide partnerinin adına sahte imza attın mı?",
  "Hiç bir ilişkide partnerinin adına sahte beyanda bulundun mu?",
  "Hiç bir ilişkide partnerini tehdit ettin mi?",
  "Hiç bir ilişkide partnerini şantaj yaptın mı?",
  "Hiç bir ilişkide partnerini ifşa ettin mi?",
  "Hiç bir ilişkide partnerini karaladın mı?",
  "Hiç bir ilişkide partnerini aşağıladın mı?",
  "Hiç bir ilişkide partnerini küçük düşürdün mü?",
  "Hiç bir ilişkide partnerini manipüle ettin mi?",
  "Hiç bir ilişkide partnerini gaslighting yaptın mı?",
  "Hiç bir ilişkide partnerini izole ettin mi?",
  "Hiç bir ilişkide partnerini kontrol ettin mi?",
  "Hiç bir ilişkide partnerini cezalandırdın mı?",
  "Hiç bir ilişkide partnerini ödüllendirdin mi?",
  "Hiç bir ilişkide partnerini koşullu sevgiyle büyüttün mü?",
  "Hiç bir ilişkide partnerini suçluluk duygusuyla yönettin mi?",
  "Hiç bir ilişkide partnerini korkuyla yönettin mi?",
  "Hiç bir ilişkide partnerini utançla yönettin mi?",
  "Hiç bir ilişkide partnerini borçla yönettin mi?",
  "Hiç bir ilişkide partnerini bağımlılıkla yönettin mi?",
  "Hiç bir ilişkide partnerini hastalıkla yönettin mi?",
  "Hiç bir ilişkide partnerini hamilelikle yönettin mi?",
  "Hiç bir ilişkide partnerini çocukla yönettin mi?",
  "Hiç bir ilişkide partnerini evlilikle yönettin mi?",
  "Hiç bir ilişkide partnerini boşanmayla tehdit ettin mi?",
  "Hiç bir ilişkide partnerini intiharla tehdit ettin mi?",
  "Hiç bir ilişkide partnerini kendine zarar vermekle tehdit ettin mi?",
  "Hiç bir ilişkide partnerini ailesine zarar vermekle tehdit ettin mi?",
  "Hiç bir ilişkide partnerini arkadaşlarına zarar vermekle tehdit ettin mi?",
  "Hiç bir ilişkide partnerini işine zarar vermekle tehdit ettin mi?",
  "Hiç bir ilişkide partnerini itibarına zarar vermekle tehdit ettin mi?",
  "Hiç bir ilişkide partnerini canına zarar vermekle tehdit ettin mi?",

  // --- Fanteziler ve Arzular (121-180) ---
  "En gizli cinsel fantezin nedir?",
  "Hiç fantezini gerçekleştirdin mi?",
  "Hiç fantezini birine anlattın mı?",
  "Hiç fantezini yazıya döktün mü?",
  "Hiç fantezini çizdin mi?",
  "Hiç fantezini seslendirdin mi?",
  "Hiç fantezini video kaydettin mi?",
  "Hiç fantezini canlı yayınladın mı?",
  "Hiç fantezini sosyal medyada paylaştın mı?",
  "Hiç fantezini bir gruba gönderdin mi?",
  "Hiç fantezini bir yabancıya anlattın mı?",
  "Hiç fantezini bir terapiste anlattın mı?",
  "Hiç fantezini bir arkadaşına anlattın mı?",
  "Hiç fantezini bir aile üyesine anlattın mı?",
  "Hiç fantezini partnerine anlattın mı?",
  "Hiç fantezini eski partnerine anlattın mı?",
  "Hiç fantezini potansiyel partnerine anlattın mı?",
  "Hiç fantezini bir iş arkadaşına anlattın mı?",
  "Hiç fantezini bir komşuya anlattın mı?",
  "Hiç fantezini bir öğretmene anlattın mı?",
  "Hiç fantezini bir öğrenciye anlattın mı?",
  "Hiç fantezini bir doktora anlattın mı?",
  "Hiç fantezini bir hemşireye anlattın mı?",
  "Hiç fantezini bir polise anlattın mı?",
  "Hiç fantezini bir avukata anlattın mı?",
  "Hiç fantezini bir hakime anlattın mı?",
  "Hiç fantezini bir politikacıya anlattın mı?",
  "Hiç fantezini bir ünlüye anlattın mı?",
  "Hiç fantezini bir yabancıya mesajla gönderdin mi?",
  "Hiç fantezini bir yabancıya mektupla gönderdin mi?",
  "Hiç fantezini bir yabancıya e-postayla gönderdin mi?",
  "Hiç fantezini bir yabancıya faksla gönderdin mi?",
  "Hiç fantezini bir yabancıya telgrafla gönderdin mi?",
  "Hiç fantezini bir yabancıya carrier pigeon ile gönderdin mi?",
  "Hiç fantezini bir yabancıya şişe içinde gönderdin mi?",
  "Hiç fantezini bir yabancıya balonla gönderdin mi?",
  "Hiç fantezini bir yabancıya dronla gönderdin mi?",
  "Hiç fantezini bir yabancıya roketle gönderdin mi?",
  "Hiç fantezini bir yabancıya uyduyla gönderdin mi?",
  "Hiç fantezini bir yabancıya uzaylıyla gönderdin mi?",
  "Hiç fantezini bir yabancıya hayvanla gönderdin mi?",
  "Hiç fantezini bir yabancıya bitkiyle gönderdin mi?",
  "Hiç fantezini bir yabancıya mantarla gönderdin mi?",
  "Hiç fantezini bir yabancıya bakteriyle gönderdin mi?",
  "Hiç fantezini bir yabancıya virüsle gönderdin mi?",
  "Hiç fantezini bir yabancıya prionla gönderdin mi?",
  "Hiç fantezini bir yabancıya viroidle gönderdin mi?",
  "Hiç fantezini bir yabancıya plasmidle gönderdin mi?",
  "Hiç fantezini bir yabancıya transpozonla gönderdin mi?",
  "Hiç fantezini bir yabancıya retrotranspozonla gönderdin mi?",
  "Hiç fantezini bir yabancıya DNA ile gönderdin mi?",
  "Hiç fantezini bir yabancıya RNA ile gönderdin mi?",
  "Hiç fantezini bir yabancıya proteinle gönderdin mi?",
  "Hiç fantezini bir yabancıya lipidle gönderdin mi?",
  "Hiç fantezini bir yabancıya karbonhidratla gönderdin mi?",
  "Hiç fantezini bir yabancıya vitaminle gönderdin mi?",
  "Hiç fantezini bir yabancıya mineralle gönderdin mi?",
  "Hiç fantezini bir yabancıya suyla gönderdin mi?",
  "Hiç fantezini bir yabancıya havayla gönderdin mi?",
  "Hiç fantezini bir yabancıya ateşle gönderdin mi?",

  // --- Sırlar ve İtiraflar (181-240) ---
  "En büyük sırrın nedir?",
  "Hiç bir sırrı ifşa ettin mi?",
  "Hiç bir sırrı tuttun mu?",
  "Hiç bir sırrı unuttun mu?",
  "Hiç bir sırrı yanlış hatırladın mı?",
  "Hiç bir sırrı rüyanda gördün mü?",
  "Hiç bir sırrı konuşurken ağzından kaçırdın mı?",
  "Hiç bir sırrı sarhoşken anlattın mı?",
  "Hiç bir sırrı uykunda söyledin mi?",
  "Hiç bir sırrı hipnoz altında anlattın mı?",
  "Hiç bir sırrı doğruluk serumu altında anlattın mı?",
  "Hiç bir sırrı yalan makinesi altında anlattın mı?",
  "Hiç bir sırrı işkence altında anlattın mı?",
  "Hiç bir sırrı tehdit altında anlattın mı?",
  "Hiç bir sırrı şantaj altında anlattın mı?",
  "Hiç bir sırrı rüşvet karşılığı anlattın mı?",
  "Hiç bir sırrı ödül karşılığı anlattın mı?",
  "Hiç bir sırrı ceza korkusuyla anlattın mı?",
  "Hiç bir sırrı vicdan azabıyla anlattın mı?",
  "Hiç bir sırrı rahatlama amacıyla anlattın mı?",
  "Hiç bir sırrı terapi amacıyla anlattın mı?",
  "Hiç bir sırrı günah çıkarma amacıyla anlattın mı?",
  "Hiç bir sırrı itiraf amacıyla anlattın mı?",
  "Hiç bir sırrı özür amacıyla anlattın mı?",
  "Hiç bir sırrı affetme amacıyla anlattın mı?",
  "Hiç bir sırrı unutma amacıyla anlattın mı?",
  "Hiç bir sırrı hatırlama amacıyla anlattın mı?",
  "Hiç bir sırrı öğrenme amacıyla anlattın mı?",
  "Hiç bir sırrı öğretme amacıyla anlattın mı?",
  "Hiç bir sırrı paylaşma amacıyla anlattın mı?",
  "Hiç bir sırrı saklama amacıyla anlattın mı?",
  "Hiç bir sırrı yok etme amacıyla anlattın mı?",
  "Hiç bir sırrı yaratma amacıyla anlattın mı?",
  "Hiç bir sırrı değiştirme amacıyla anlattın mı?",
  "Hiç bir sırrı çoğaltma amacıyla anlattın mı?",
  "Hiç bir sırrı azaltma amacıyla anlattın mı?",
  "Hiç bir sırrı bölme amacıyla anlattın mı?",
  "Hiç bir sırrı çarpma amacıyla anlattın mı?",
  "Hiç bir sırrı toplama amacıyla anlattın mı?",
  "Hiç bir sırrı çıkarma amacıyla anlattın mı?",
  "Hiç bir sırrı integral alma amacıyla anlattın mı?",
  "Hiç bir sırrı türev alma amacıyla anlattın mı?",
  "Hiç bir sırrı limit alma amacıyla anlattın mı?",
  "Hiç bir sırrı süreklilik amacıyla anlattın mı?",
  "Hiç bir sırrı süreksizlik amacıyla anlattın mı?",
  "Hiç bir sırrı yakınsaklık amacıyla anlattın mı?",
  "Hiç bir sırrı ıraksaklık amacıyla anlattın mı?",
  "Hiç bir sırrı diziler amacıyla anlattın mı?",
  "Hiç bir sırrı seriler amacıyla anlattın mı?",
  "Hiç bir sırrı fonksiyonlar amacıyla anlattın mı?",
  "Hiç bir sırrı matrisler amacıyla anlattın mı?",
  "Hiç bir sırrı determinantlar amacıyla anlattın mı?",
  "Hiç bir sırrı özdeğerler amacıyla anlattın mı?",
  "Hiç bir sırrı özvektörler amacıyla anlattın mı?",
  "Hiç bir sırrı lineer dönüşümler amacıyla anlattın mı?",
  "Hiç bir sırrı vektör uzayları amacıyla anlattın mı?",
  "Hiç bir sırrı iç çarpım uzayları amacıyla anlattın mı?",
  "Hiç bir sırrı normlu uzaylar amacıyla anlattın mı?",
  "Hiç bir sırrı metrik uzaylar amacıyla anlattın mı?",
  "Hiç bir sırrı topolojik uzaylar amacıyla anlattın mı?",

  // --- Davranışlar ve Alışkanlıklar (241-300) ---
  "En utanç verici alışkanlığın nedir?",
  "Hiç tırnak yedin mi?",
  "Hiç burun karıştırdın mı?",
  "Hiç osurdun mu ve suçu başkasına attın mı?",
  "Hiç geğirdin mi ve özür dilemedin mi?",
  "Hiç tuvalete gittin mi ve elini yıkamadın mı?",
  "Hiç duş almadın mı ve dışarı çıktın mı?",
  "Hiç dişlerini fırçalamadın mı ve birine sarıldın mı?",
  "Hiç iç çamaşırını değiştirmedin mi ve birine sarıldın mı?",
  "Hiç çorabını değiştirmedin mi ve ayakkabı çıkardın mı?",
  "Hiç aynı kıyafeti üst üste giydin mi?",
  "Hiç aynı iç çamaşırını üst üste giydin mi?",
  "Hiç aynı çorabı üst üste giydin mi?",
  "Hiç banyo yapmadan havuza girdin mi?",
  "Hiç duş almadan denize girdin mi?",
  "Hiç duş almadan güneşlendin mi?",
  "Hiç duş almadan spor yaptın mı?",
  "Hiç duş almadan işe gittin mi?",
  "Hiç duş almadan okula gittin mi?",
  "Hiç duş almadan partiye gittin mi?",
  "Hiç duş almadan randevuya gittin mi?",
  "Hiç duş almadan düğüne gittin mi?",
  "Hiç duş almadan cenazeye gittin mi?",
  "Hiç duş almadan mezuniyete gittin mi?",
  "Hiç duş almadan mülakata gittin mi?"
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

// =====================================================
//  CESARETLİK SORULARI (50 Adet)
// =====================================================
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


// =====================================================
//  ADAM ASMACA KELİME HAVUZU
// =====================================================

  "KELEBEK", "BİLGİSAYAR", "TELEFON", "İSTANBUL", "KARPUZ",
  "ÖĞRETMEN", "DENİZ", "YILDIZ", "KİTAP", "ÇİÇEK",
  "BULUT", "GÖKYÜZÜ", "MUTLULUK", "ARKADAŞ", "OKYANUS",
  "PENCERE", "KEÇİ", "SAAT", "PORTAKAL", "MÜZİK",
  "TÜRKİYE", "ANADOLU", "KAHVE", "BALIK", "KEDİ"


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
