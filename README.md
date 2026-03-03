# Çınar Gayrimenkul İlan Platformu

Bu depo, [www.cinaremlakcigli.com](https://www.cinaremlakcigli.com) adresi üzerinden hizmet veren Çınar Gayrimenkul'ün modern ve dinamik emlak ilan platformunun kaynak kodlarını içermektedir.

## 🚀 Proje Hakkında

Çınar Gayrimenkul web sitesi, Next.js kullanılarak geliştirilmiş, hızlı, SEO uyumlu ve kullanıcı dostu bir platformdur. Kullanıcılar, güncel gayrimenkul ilanlarını detaylı filtreleme seçenekleri ile inceleyebilir ve yüksek çözünürlüklü görsellerle ilan detaylarına ulaşabilirler.

## ⚙️ Teknik Altyapı ve Veri Yönetimi

Platformun ilan verileri, **özel olarak geliştirilmiş bir Python web kazıma (scraping) betiği** aracılığıyla yönetilmektedir.

- **Otomatik Veri Senkronizasyonu**: Python betiğimiz, Sahibinden.com üzerindeki güncel ilan verilerini düzenli olarak tarar (scrape eder).
- **Veritabanı Entegrasyonu**: Elde edilen veriler, arka planda güvenli bir şekilde Supabase veritabanımıza (PostgreSQL) aktarılır (push edilir).
- **Güvenlik**: Veri çekme ve işleme süreçlerinde kullanılan Python kaynak kodları ve API anahtarları, güvenlik politikalarımız gereği bu açık depoda (public repository) **paylaşılmamaktadır**.

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: Next.js (App Router), React
- **Stil**: Özel CSS (Modern ve Responsive Tasarım)
- **Backend & Veritabanı**: Supabase (PostgreSQL, Auth, Storage)
- **Veri Sağlayıcı**: Özel Python Scraper (Kapalı Kaynak)

## 📞 İletişim

Detaylı bilgi ve iletişim için web sitemizi ziyaret edebilirsiniz: [www.cinaremlakcigli.com](https://www.cinaremlakcigli.com)
