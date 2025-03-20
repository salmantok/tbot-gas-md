# tbot-gas-md

> Telegram Bot [GAS (Google Apps Script)](https://script.google.com) Markdown

## Kloning Repositori

```sh
git clone https://github.com/salmantok/tbot-gas-md.git && cd tbot-gas-md
```

## Penggunaan

Untuk menggunakannya, selesaikan konfigurasi fungsi `setProperties`, lalu jalankan fungsi tersebut sekali, lalu hapus fungsi tersebut (opsional) karena tidak lagi diperlukan. Kemudian jalankan fungsi `setWebhook`.

> Catatan: Jika menggunakan [@google/clasp](https://developers.google.com/apps-script/guides/clasp), pastikan `scriptId` di file `.clasp.json` sudah benar.

## Cara Menambahkan Perintah ke Bot

Bot ini membaca file `.md` untuk merespons perintah. Setiap file `.md` yang dibuat akan menjadi perintah bot dengan nama file sebagai nama perintah.

### Contoh:

Buat file `start.md` untuk menangani perintah `/start`.

#### Isi `start.md`:

```md
Halo! Selamat datang di bot.
```

#### Hasil di Telegram:

`Halo! Selamat datang di bot.`

## Menggunakan `await` untuk Mengirim Beberapa Pesan

Jika ingin mengirim beberapa pesan secara terpisah, gunakan `await` di antara baris teks.

#### Isi `start.md`:

```md
Halo!
await
Selamat datang di bot.
```

#### Hasil di Telegram:

`Halo!`

`Selamat datang di bot.`

## Menggunakan Event Listener dengan `on.md`

Bot akan membalas pesan yang bukan perintah menggunakan isi dari file `on.md`.

#### Isi `on.md`:

```md
Silakan gunakan perintah /start
```

#### Hasil di Telegram:

Jika pengguna mengirim pesan yang bukan perintah (misalnya: `Halo`, `P`), bot akan membalas dengan:

`Silakan gunakan perintah /start`

## Penggunaan `hears.md`

`hears.md` digunakan untuk menangani respons otomatis berdasarkan teks yang dikirim oleh pengguna. Jika pesan cocok dengan kata kunci dalam file ini, bot akan membalas dengan respons yang sesuai.

### Cara Membuat `hears.md`

Buat file `hears.md` di Google Drive dengan format berikut:

```md
Kata Kunci: Respons
Kata Kunci 2: Respons 2
```

#### Contoh isi `hears.md`:

```md
Assalamu'alaikum: Wa'alaikum salam
Selamat pagi: Selamat pagi! Semoga harimu menyenangkan.
Hai: Halo! Ada yang bisa saya bantu?
Apa kabar: Alhamdulillah baik, bagaimana denganmu?
```

### Cara Kerja

1. Pengguna mengirim pesan yang bukan perintah (`/command`).
2. Bot membaca `hears.md` dan mencari kata kunci yang cocok.
3. Jika ditemukan, bot mengirim respons yang sesuai.
4. Jika tidak ada kecocokan, bot akan mengeksekusi `on.md` jika ada.

### Hasil di Telegram

#### Jika pengguna mengirim:

`Assalamu'alaikum`

#### Bot membalas:

`Wa'alaikum salam`

#### Jika pengguna mengirim:

`Apa kabar`

#### Bot membalas:

`Alhamdulillah baik, bagaimana denganmu?`

#### Jika pengguna mengirim sesuatu yang tidak ada di `hears.md` (misalnya `"Halo"`)

Jika `on.md` berisi:

```md
Silakan gunakan perintah /start
```

Maka bot membalas:

`Silakan gunakan perintah /start`

> Catatan Penting:

- Gunakan format `kata kunci: respons` dengan tanda `:` sebagai pemisah.
- Jangan gunakan spasi ekstra sebelum atau setelah `:`.
- Bot membandingkan teks secara case-insensitive, jadi `"Hai"` atau `"hai"` akan tetap dikenali.
- Bot hanya menangani satu respons per kata kunci. Jika ingin menangani variasi kata, tambahkan baris baru.

#### Contoh:

```md
Hai: Halo!
hai: Halo juga!
```

Dengan ini, bot akan mengenali baik `"Hai"` maupun `"hai"` sebagai input valid.

## API

[Telegram Bot API](https://core.telegram.org/bots/api)

## Support

[Telegram bot release](https://t.me/tbot_release)
