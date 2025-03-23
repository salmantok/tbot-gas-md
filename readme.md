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

## Menggunakan `{reply}` untuk Mengirim Beberapa Pesan

Jika ingin mengirim beberapa pesan secara terpisah, gunakan `{reply}` di antara baris teks.

#### Isi `start.md`:

```md
Halo!

{reply}

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

Buat file `hears.md` dengan format berikut:

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

## Penggunaan Inline Keyboard

Inline keyboard memungkinkan pengguna berinteraksi langsung dengan bot tanpa perlu mengetik perintah tambahan.

### Format Inline Keyboard dalam Markdown

Bot ini mendukung inline keyboard dengan format sebagai berikut:

```md
[Teks Tombol](callback:data)
[Teks Tombol](url:https://example.com)
```

### Penjelasan:

- `callback:data` → Tombol akan mengirim `callback_data` ke bot saat ditekan.
- `url:https://example.com` → Tombol akan membuka URL saat ditekan.

### Contoh Penggunaan Inline Keyboard dalam Pesan

#### Pesan dengan Satu Tombol:

```md
Klik tombol di bawah ini untuk menyapa:
[Say Hello](callback:hello)
```

#### Hasil:

- Teks: `"Klik tombol di bawah ini untuk menyapa:"`
- Tombol: `"Say Hello"` → (Mengirim callback `"hello"`)

#### Pesan dengan Banyak Tombol:

```md
Pilih opsi yang tersedia:
[Google](url:https://google.com)
[Bing](url:https://bing.com)
[Say Hi](callback:hi)
```

#### Hasil:

- `"Google"` → Buka `https://google.com`
- `"Bing"` → Buka `https://bing.com`
- `"Say Hi"` → Kirim callback `"hi"` ke bot

#### Pesan dengan beberapa tombol Baris Baru:

Untuk membuat beberapa tombol dengan baris baru, gunakan pemisah `---`:

```md
Silakan pilih:
[Tombol 1](callback:one)
[Tombol 2](callback:two)

---

[Tombol 3](callback:three)
```

#### Hasil:

`Silakan pilih:`

`[ Tombol 1 ][ Tombol 2 ]`

`[ Tombol 3 ]`

- Tombol 1 dan 2 berada dalam satu baris
- Tombol 3 ada di bawahnya

### Kesimpulan

- ️ Mendukung tombol URL
- ️ Mendukung tombol callback
- ️ Callback dapat ditangani dengan benar

Sekarang bot siap digunakan dengan inline keyboard yang berfungsi dengan baik!

## Penggunaan Fitur Popup

Fitur `popup` digunakan untuk menampilkan pesan pop-up di Telegram ketika pengguna menekan tombol inline keyboard.

### Cara Penggunaan di Markdown

Gunakan format berikut dalam file Markdown (`.md`):

```md
[Klik Saya](callback:popup:Ini adalah popup!)
```

Atau, jika ingin popup sekaligus mengirim pesan ke chat:

```
[Klik Saya](callback:popup+message:Ini popup!:Pesan baru yang dikirim)
```

### Contoh Kasus

#### Hanya menampilkan popup

```md
[Info](callback:popup:Selamat datang di bot kami!)
```

Saat tombol diklik, popup akan muncul tanpa mengirim pesan baru.

#### Menampilkan popup dan mengirim pesan baru

```md
[Konfirmasi](callback:popup+message:Berhasil!:Data Anda telah disimpan)
```

Saat tombol diklik, popup muncul dan bot mengirim pesan `"Data Anda telah disimpan"` ke chat.

## Fitur Hapus Pesan

Fitur ini memungkinkan Markdown menentukan pesan yang akan dihapus secara otomatis setelah beberapa detik.

### Cara Penggunaan di Markdown

Gunakan format berikut di file `.md`:

```md
Pesan ini akan otomatis terhapus dalam 5 detik.
{deleteMessage:5}
```

Angka setelah `{deleteMessage:}` menunjukkan waktu dalam detik sebelum pesan dihapus.

### Contoh Kasus

#### Menghapus pesan setelah 10 detik

```md
Pesan ini akan dihapus dalam 10 detik.
{deleteMessage:10}
```

#### Menghapus pesan yang berisi tombol inline

```md
Pilih opsi di bawah ini:
[Opsi 1](callback:data1)

---

[Opsi 2](callback:data2)
{deleteMessage:7}
```

Pesan akan dihapus setelah 7 detik, termasuk tombol-tombolnya.

## Kesimpulan

- `popup` Menampilkan pesan pop-up saat tombol ditekan
- `popup+message` Menampilkan popup dan mengirim pesan baru
- `{deleteMessage:X}` Menghapus pesan setelah X detik

Silakan gunakan fitur ini dalam bot Anda untuk pengalaman yang lebih interaktif!

## API

[Telegram Bot API](https://core.telegram.org/bots/api)

## Support

[Telegram bot release](https://t.me/tbot_release)
