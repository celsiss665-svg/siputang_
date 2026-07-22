# SIPUTANG - Sistem Pencatatan Utang-Piutang Berbasis Blockchain

## Cara Menjalankan
1. Jalankan node lokal: `anvil`
2. (Opsional) Jalankan Geth private net di port 8546
3. Deploy contract: `forge create src/CatatanUtang.sol:CatatanUtang --rpc-url http://127.0.0.1:8545 --private-key $PK --broadcast`
4. Install dependency aplikasi: `npm install`
5. Jalankan aplikasi: `node app/siputang.js`

## Info Kontrak
- Alamat CatatanUtang: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- Tx Hash Deploy: 0xa3fd65a3c3701ded2b9e7a32251f9127a053b2d7877d2414cd58ce2846e1aab7
- RPC Endpoint: http://127.0.0.1:8545 (Anvil)

## Anggota Tim
- Sry Chelsia Lembang (672023244) - Langkah 1, 2, 5, 7 + kolaborasi aplikasi
- Agnes Melinda Sari (672023222) - Langkah 3, 4, 6 + kolaborasi aplikasi
