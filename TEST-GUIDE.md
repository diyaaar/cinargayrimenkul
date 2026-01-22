# Çınar Gayrimenkul Web Sitesi Test Rehberi

## 🚀 Hızlı Başlangıç

### Python ile Test (Önerilen)
```bash
# Windows
start-server.bat

# Mac/Linux
chmod +x start-server.sh
./start-server.sh
```

Tarayıcınızda `http://localhost:8000` adresini açın.

## ✅ Test Kontrol Listesi

### 1. Ana Sayfa (index.html)
- [ ] Hero slider otomatik çalışıyor
- [ ] Slider kontrolleri (ok tuşları, dots) çalışıyor
- [ ] "İlanlarımızı İnceleyin" butonu Sahibinden.com'a yönlendiriyor
- [ ] İstatistik sayaçları animasyonlu olarak artıyor
- [ ] Scroll animasyonları çalışıyor
- [ ] Mobil menü (hamburger) açılıyor/kapanıyor

### 2. Hakkımızda Sayfası (about.html)
- [ ] Sayfa geçişi sorunsuz
- [ ] Ekip kartı hover efektleri çalışıyor
- [ ] Sosyal medya linkleri doğru
- [ ] İstatistikler animasyonlu

### 3. Hizmetler Sayfası (services.html)
- [ ] Hizmet kartları hover efektleri
- [ ] Süreç adımları animasyonlu
- [ ] Bölge kartları çalışıyor
- [ ] CTA butonları yönlendiriyor

### 4. İletişim Sayfası (contact.html)
- [ ] İletişim formu validasyonu çalışıyor
- [ ] Telefon/email linkleri çalışıyor
- [ ] Google Maps yükleniyor
- [ ] SSS accordion açılıyor/kapanıyor
- [ ] Form gönderim simülasyonu çalışıyor

### 5. Responsive Test
- [ ] Mobil görünüm (320px-767px)
- [ ] Tablet görünüm (768px-1199px)
- [ ] Desktop görünüm (1200px+)
- [ ] Menü mobilde hamburger oluyor
- [ ] Kartlar tek sütun oluyor (mobil)

### 6. Animasyonlar
- [ ] Scroll sırasında fade-in efektleri
- [ ] Buton hover animasyonları
- [ ] Kart hover efektleri
- [ ] Loading animasyonları
- [ ] Smooth scrolling

### 7. Linkler ve Yönlendirmeler
- [ ] Sahibinden.com linkleri yeni sekmede açılıyor
- [ ] Telefon linkleri arama uygulamasını açıyor
- [ ] Email linkleri mail uygulamasını açıyor
- [ ] Sosyal medya linkleri doğru
- [ ] İç sayfa linkleri çalışıyor

## 🐛 Bilinen Sınırlamalar

### Form Gönderimi
- Form gerçek email göndermez (backend gerekli)
- Simülasyon mesajı gösterir
- WordPress versiyonunda çalışacak

### Harita
- Google Maps iframe kullanır
- Gerçek konum gösterir
- API key gerekmez

### Görseller
- Unsplash CDN'den yüklenir
- İnternet bağlantısı gerekir
- Yavaş bağlantılarda geç yüklenebilir

## 🔧 Sorun Giderme

### JavaScript Çalışmıyor
1. Tarayıcı konsolunu açın (F12)
2. Hata mesajlarını kontrol edin
3. JavaScript'in aktif olduğundan emin olun

### CSS Yüklenmiyor
1. Dosya yollarını kontrol edin
2. CORS hatası varsa HTTP server kullanın
3. Tarayıcı cache'ini temizleyin

### Responsive Çalışmıyor
1. Tarayıcı geliştirici araçlarını açın (F12)
2. Device toolbar'ı aktifleştirin
3. Farklı cihaz boyutlarını test edin

## 📱 Mobil Test

### Chrome DevTools
1. F12 basın
2. Device toolbar'ı açın (Ctrl+Shift+M)
3. Farklı cihazları seçin:
   - iPhone SE (375x667)
   - iPad (768x1024)
   - Desktop (1920x1080)

### Gerçek Cihaz Testi
1. Aynı ağdaki mobil cihazdan
2. Bilgisayarın IP adresini bulun
3. `http://[IP]:8000` adresini açın

## 🎯 Performans Testi

### PageSpeed Insights
1. https://pagespeed.web.dev/ adresine gidin
2. Site URL'ini girin
3. Mobil ve desktop skorlarını kontrol edin

### Lighthouse (Chrome)
1. F12 > Lighthouse sekmesi
2. "Generate report" tıklayın
3. Performance, SEO, Accessibility skorlarını inceleyin

## 📊 Test Sonuçları

### Beklenen Performans
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 85+

### Beklenen Özellikler
- ✅ Tüm animasyonlar çalışır
- ✅ Form validasyonu aktif
- ✅ Responsive tasarım
- ✅ Hızlı yükleme (<3 saniye)
- ✅ SEO dostu yapı

## 🚀 Canlıya Alma Öncesi

### Son Kontroller
- [ ] Tüm sayfalar test edildi
- [ ] Mobil uyumluluk OK
- [ ] Linkler çalışıyor
- [ ] Formlar test edildi
- [ ] Performans kabul edilebilir
- [ ] SEO kontrolleri yapıldı

### Hosting Hazırlığı
1. Dosyaları ZIP olarak paketleyin
2. Hosting paneline yükleyin
3. SSL sertifikası aktifleştirin
4. DNS ayarlarını yapın
5. Final testleri gerçekleştirin

Bu rehber ile web sitenizi kapsamlı olarak test edebilir ve sorunları önceden tespit edebilirsiniz.