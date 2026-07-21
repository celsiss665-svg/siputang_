
const { ethers } = require("ethers");
const readline = require("readline");
const chalk = require("chalk");
const abi = require("../abi.json");

const RPC_URL = "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const DAFTAR_AKUN = {
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc": "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  "0x90f79bf6eb2c4f870365e785982e1f101e93b906": "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65": "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc": "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  "0x976ea74026e726554db657fa54763abd0c3a0aa9": "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
  "0x14dc79964da2c08b23698b3d3cc7ca32193d9955": "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  "0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f": "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  "0xa0ee7a142d267c1f36714e4a8f75612f20a79720": "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
};

const PK_PEMBERI = DAFTAR_AKUN["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const readContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

function tampilkanBanner() {
  console.log(chalk.cyan(`
 ███████╗██╗██████╗ ██╗   ██╗████████╗ █████╗ ███╗   ██╗ ██████╗ 
 ██╔════╝██║██╔══██╗██║   ██║╚══██╔══╝██╔══██╗████╗  ██║██╔════╝ 
 ███████╗██║██████╔╝██║   ██║   ██║   ███████║██╔██╗ ██║██║  ███╗
 ╚════██║██║██╔═══╝ ██║   ██║   ██║   ██╔══██║██║╚██╗██║██║   ██║
 ███████║██║██║     ╚██████╔╝   ██║   ██║  ██║██║ ╚████║╚██████╔╝
 ╚══════╝╚═╝╚═╝      ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
  `));
  console.log(chalk.gray("     Sistem Pencatatan Utang-Piutang Berbasis Blockchain\n"));
}

async function ambilSemuaUtang() {
  const total = await readContract.jumlahUtang();
  const daftar = [];
  for (let i = 0; i < total; i++) {
    const [peminjam, pemberi, jumlahAwal, sisa, keterangan, lunas] = await readContract.cekUtang(i);
    daftar.push({ id: i, peminjam, pemberi, jumlahAwal, sisa, keterangan, lunas });
  }
  return daftar;
}

async function tampilkanRingkasan() {
  const daftar = await ambilSemuaUtang();
  const totalLunas = daftar.filter(u => u.lunas).length;
  const totalBelumLunas = daftar.length - totalLunas;
  const totalSisa = daftar.reduce((sum, u) => sum + Number(u.sisa), 0);

  console.log(chalk.yellow("📊 Ringkasan:"));
  console.log(`   Total utang tercatat : ${daftar.length}`);
  console.log(`   Sudah lunas          : ${chalk.green(totalLunas)}`);
  console.log(`   Belum lunas          : ${chalk.red(totalBelumLunas)}`);
  console.log(`   Total sisa tertunggak: Rp ${totalSisa.toLocaleString("id-ID")}\n`);
}

async function tampilkanDaftarUtang(hanyaBelumLunas = false) {
  let daftar = await ambilSemuaUtang();
  if (hanyaBelumLunas) {
    daftar = daftar.filter(u => !u.lunas);
  }
  if (daftar.length === 0) {
    console.log(chalk.gray(hanyaBelumLunas ? "Tidak ada utang yang belum lunas.\n" : "Belum ada utang tercatat.\n"));
    return daftar;
  }
  console.log(chalk.yellow(`\n📋 Daftar Utang${hanyaBelumLunas ? " (Belum Lunas)" : ""}:`));
  console.log("─".repeat(70));
  daftar.forEach(u => {
    const status = u.lunas ? chalk.green("LUNAS ✅") : chalk.red(`BELUM LUNAS (sisa Rp${Number(u.sisa).toLocaleString("id-ID")})`);
    console.log(`ID ${u.id} | ${u.keterangan} | Awal: Rp${Number(u.jumlahAwal).toLocaleString("id-ID")} | ${status}`);
    console.log(`     Peminjam: ${u.peminjam}`);
  });
  console.log("─".repeat(70) + "\n");
  return daftar;
}

async function catatUtangBaru(alamatPeminjam, jumlah, keterangan) {
  const wallet = new ethers.Wallet(PK_PEMBERI, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
  const idBaru = await readContract.jumlahUtang();
  console.log(chalk.cyan("Mengirim transaksi: mencatat utang baru..."));
  const tx = await contract.catatUtang(alamatPeminjam, jumlah, keterangan);
  const receipt = await tx.wait();
  console.log(chalk.green(`✅ Utang tercatat dengan ID: ${idBaru}`));
  console.log("   Tx hash:", receipt.hash);
  console.log("   Gas terpakai:", receipt.gasUsed.toString());
}

async function bayarSebagian(id, jumlahBayar, alamatPeminjam) {
  const pkPeminjam = DAFTAR_AKUN[alamatPeminjam.toLowerCase()];
  if (!pkPeminjam) {
    throw new Error("Akun peminjam ini tidak dikenali aplikasi (bukan akun test Anvil bawaan).");
  }
  const walletPeminjamDinamis = new ethers.Wallet(pkPeminjam, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, walletPeminjamDinamis);
  console.log(chalk.cyan(`Mengirim transaksi: membayar Rp${jumlahBayar} untuk utang ID ${id}...`));
  const tx = await contract.bayarSebagian(id, jumlahBayar);
  const receipt = await tx.wait();
  console.log(chalk.green("✅ Pembayaran berhasil!"));
  console.log("   Tx hash:", receipt.hash);
  console.log("   Gas terpakai:", receipt.gasUsed.toString());
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function tunggu(pesan = "Tekan Enter untuk kembali ke menu...") {
  return new Promise(resolve => {
    console.log(chalk.gray(`\n${pesan}`));
    rl.question("", () => resolve());
  });
}

function tanya(pertanyaan) {
  return new Promise(resolve => rl.question(pertanyaan, resolve));
}

async function prosesMenu1() {
  const peminjam = await tanya("Alamat peminjam: ");
  if (!ethers.isAddress(peminjam)) {
    console.log(chalk.red("❌ Alamat tidak valid!"));
    await tunggu();
    return;
  }
  const jumlah = await tanya("Jumlah (Rp): ");
  if (isNaN(jumlah) || Number(jumlah) <= 0) {
    console.log(chalk.red("❌ Jumlah harus berupa angka lebih dari 0."));
    await tunggu();
    return;
  }
  const ket = await tanya("Keterangan: ");
  try {
    await catatUtangBaru(peminjam, jumlah, ket);
  } catch (err) {
    console.log(chalk.red("❌ Transaksi gagal: " + (err.reason || err.shortMessage || err.message)));
  }
  await tunggu();
}

async function prosesMenu2() {
  console.clear();
  await tampilkanDaftarUtang(false);
  await tunggu();
}

async function prosesMenu3() {
  const daftarBelumLunas = await tampilkanDaftarUtang(true);
  if (daftarBelumLunas.length === 0) {
    await tunggu();
    return;
  }
  const idInput = await tanya("Pilih ID utang yang mau dibayar (lihat daftar di atas): ");
  const idValid = daftarBelumLunas.find(u => u.id.toString() === idInput.trim());
  if (!idValid) {
    console.log(chalk.red("❌ ID tidak ditemukan di daftar belum lunas, atau utang tersebut sudah lunas."));
    await tunggu();
    return;
  }
  if (!DAFTAR_AKUN[idValid.peminjam.toLowerCase()]) {
    console.log(chalk.red(`❌ Peminjam utang ini (${idValid.peminjam}) bukan akun test Anvil yang dikenali aplikasi.`));
    await tunggu();
    return;
  }
  const jumlahInput = await tanya("Jumlah yang mau dibayar (Rp): ");
  if (isNaN(jumlahInput) || Number(jumlahInput) <= 0 || Number(jumlahInput) > Number(idValid.sisa)) {
    console.log(chalk.red(`❌ Jumlah tidak valid. Sisa utang saat ini: Rp${Number(idValid.sisa).toLocaleString("id-ID")}`));
    await tunggu();
    return;
  }
  try {
    await bayarSebagian(idValid.id, jumlahInput, idValid.peminjam);
  } catch (err) {
    console.log(chalk.red("❌ Transaksi gagal: " + (err.reason || err.shortMessage || err.message)));
  }
  await tunggu();
}

async function tampilkanMenu() {
  console.clear();
  tampilkanBanner();
  await tampilkanRingkasan();
  console.log(chalk.bold(`========== MENU SIPUTANG ==========
1. Catat Utang Baru (write)
2. Lihat Semua Utang (read)
3. Bayar Cicilan / Lunasi (write)
4. Keluar
====================================`));
  const pilihan = await tanya("Pilih menu: ");

  if (pilihan === "1") {
    await prosesMenu1();
  } else if (pilihan === "2") {
    await prosesMenu2();
  } else if (pilihan === "3") {
    await prosesMenu3();
  } else if (pilihan === "4") {
    console.clear();
    console.log(chalk.cyan("Terima kasih sudah menggunakan SIPUTANG! 👋"));
    rl.close();
    return;
  } else {
    console.log(chalk.red("❌ Pilihan tidak dikenali, masukkan angka 1-4."));
    await tunggu();
  }

  tampilkanMenu();
}

tampilkanMenu();
