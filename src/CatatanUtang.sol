// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CatatanUtang {
    struct Utang {
        address peminjam;
        address pemberiPinjaman;
        uint256 jumlahAwal;
        uint256 sisaUtang;
        string keterangan;
        bool lunas;
    }

    uint256 public jumlahUtang;
    mapping(uint256 => Utang) public daftarUtang;

    event UtangDicatat(uint256 indexed id, address indexed peminjam, address indexed pemberiPinjaman, uint256 jumlah);
    event PembayaranDiterima(uint256 indexed id, uint256 jumlahBayar, uint256 sisaSetelahBayar);
    event UtangLunas(uint256 indexed id);

    function catatUtang(address _peminjam, uint256 _jumlah, string memory _keterangan) public returns (uint256) {
        require(_jumlah > 0, "Jumlah harus lebih dari 0");
        uint256 id = jumlahUtang;
        daftarUtang[id] = Utang(_peminjam, msg.sender, _jumlah, _jumlah, _keterangan, false);
        jumlahUtang++;
        emit UtangDicatat(id, _peminjam, msg.sender, _jumlah);
        return id;
    }

    function bayarSebagian(uint256 _id, uint256 _jumlahBayar) public {
        Utang storage u = daftarUtang[_id];
        require(msg.sender == u.peminjam, "Hanya peminjam yang boleh membayar");
        require(!u.lunas, "Sudah lunas sebelumnya");
        require(_jumlahBayar > 0, "Jumlah bayar harus lebih dari 0");
        require(_jumlahBayar <= u.sisaUtang, "Jumlah bayar melebihi sisa utang");

        u.sisaUtang -= _jumlahBayar;
        emit PembayaranDiterima(_id, _jumlahBayar, u.sisaUtang);

        if (u.sisaUtang == 0) {
            u.lunas = true;
            emit UtangLunas(_id);
        }
    }

    function cekUtang(uint256 _id) public view returns (address, address, uint256, uint256, string memory, bool) {
        Utang memory u = daftarUtang[_id];
        return (u.peminjam, u.pemberiPinjaman, u.jumlahAwal, u.sisaUtang, u.keterangan, u.lunas);
    }
}
