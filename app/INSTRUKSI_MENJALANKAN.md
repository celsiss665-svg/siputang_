# Instruksi Menjalankan Aplikasi SIPUTANG 

Antarmuka command-line untuk berinteraksi dengan smart contract SIPUTANG (Sistem Pencatatan utang-piutang).

## Prasyarat

- Node blockchain lokal (**Anvil**) sudah berjalan di `http://127.0.0.1:8545`
- Smart contract sudah di-*deploy* ke jaringan tersebut
- `CONTRACT_ADDRESS` di `app/siputang.js` sudah sesuai dengan alamat hasil deploy

> Kalau belum melakukan langkah-langkah di atas, ikuti panduan setup lengkap di [README.md](../README.md) pada root repo terlebih dahulu.

## Instalasi Dependency

Dependency (`ethers`, `chalk`) di-install dari **root repo** (karena `package.json` berada di root, bukan di dalam folder ini):

```bash
# dari root repo
npm install
```

## Menjalankan Aplikasi

Dari root repo:
```bash
node app/siputang.js
```

Atau dari dalam folder `app/`:
```bash
cd app
node siputang.js
```

## Cara Pakai

Setelah dijalankan, akan muncul banner dan ringkasan utang, lalu menu berikut:

```
1. Catat Utang Baru (write)
2. Lihat Semua Utang (read)
3. Bayar Cicilan / Lunasi (write)
4. Keluar
```

### 1. Catat Utang Baru
- Masukkan **alamat peminjam** — harus salah satu dari 10 akun test bawaan Anvil (lihat daftar di `DAFTAR_AKUN` pada `app/siputang.js`)
- Masukkan **jumlah** (Rupiah, angka > 0)
- Masukkan **keterangan** bebas
- Transaksi dikirim menggunakan akun pertama Anvil sebagai pemberi utang, lalu tx hash & gas terpakai ditampilkan

### 2. Lihat Semua Utang
- Menampilkan seluruh utang tercatat: ID, keterangan, jumlah awal, status (LUNAS/BELUM LUNAS), dan alamat peminjam
- Fungsi *read-only*, tidak memerlukan gas

### 3. Bayar Cicilan / Lunasi
- Menampilkan daftar utang yang belum lunas
- Pilih **ID** utang, lalu masukkan **jumlah pembayaran** (tidak boleh melebihi sisa utang)
- Transaksi ditandatangani menggunakan private key milik peminjam yang bersangkutan (dicocokkan otomatis dari `DAFTAR_AKUN`)

### 4. Keluar
Menutup aplikasi CLI dengan aman.

## Catatan

- Alamat yang bukan bagian dari 10 akun test Anvil bawaan tidak bisa digunakan untuk membayar utang (private key-nya tidak dikenali aplikasi), karena `bayarSebagian()` butuh menandatangani transaksi atas nama peminjam.
- Semua data tersimpan langsung di smart contract (on-chain), bukan di database lokal.
