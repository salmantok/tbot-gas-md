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

## API

[Telegram Bot API](https://core.telegram.org/bots/api)

## Support

[Telegram bot release](https://t.me/tbot_release)
