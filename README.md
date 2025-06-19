# Portfolio & Admin Paneli

Bu proje, modern bir portfolyo sitesi ve yönetim paneli içerir. Proje React, TypeScript ve TailwindCSS ile geliştirilmiştir.

## Özellikler

- Dinamik portfolyo ve admin paneli
- Proje, yetenek, hakkımda ve mesaj yönetimi
- Dark mode ve modern UI/UX
- LocalStorage ile veri saklama (backend gerekmez)
- Responsive ve animasyonlu tasarım

## Kurulum ve Çalıştırma

### 1. Projeyi İndir

Projeyi zip olarak aldıysanız, bir klasöre çıkarın.  
Veya git ile klonladıysanız:
```sh
git clone <repo-linki>
cd <proje-klasörü>
```

### 2. Bağımlılıkları Kur

Aşağıdaki komutu terminalde çalıştırın:
```sh
npm install
```
> Bu komut, `package.json`'daki tüm bağımlılıkları indirir.

### 3. Geliştirme Sunucusunu Başlat

```sh
npm run dev
```
> Komut çalıştıktan sonra terminalde çıkan adresi (genellikle http://localhost:5173) tarayıcınızda açın.

### 4. Admin Paneline Giriş

- Admin paneline erişmek için `/admin/login` adresine gidin.
- Demo kullanıcı adı: `admin`
- Demo şifre: `admin123`

### 5. Proje Yapısı

```
src/
  pages/         # Sayfa bileşenleri (Home, admin paneli vs.)
  utils/         # Yardımcı fonksiyonlar (localStorage işlemleri)
  hooks/         # Özel React hook'ları
  assets/        # Görseller ve ikonlar
  layouts/       # Layout bileşenleri
public/
  favicon.ico    # Favicon
  ...
```

### 6. Notlar

- Tüm veriler (projeler, yetenekler, hakkımda, mesajlar) tarayıcıda localStorage'da saklanır.
- Projeyi build etmek için:
  ```sh
  npm run build
  ```
- Build sonrası çıkan dosyalar `dist/` klasöründe olur.

---

## Katkı ve Lisans

Bu proje kişisel portfolyo ve eğitim amaçlıdır.  
Dilediğiniz gibi geliştirebilir, paylaşabilir ve kullanabilirsiniz.

---

**Sorularınız için:**  
[LinkedIn](https://www.linkedin.com/in/harzem-umut-yıldız-2356801b7/)  
[GitHub](https://github.com/HarzemYldz)
