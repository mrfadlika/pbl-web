import React from "react";
import Katalog from "..";

// Sample data for lost items
const lostItems = [
  {
    id: 1,
    title: "Dompet",
    location: "Kampus 2",
    date: "28 April 2025",
    description:
      "Dompet dengan warna abu2 ditemukan pada kanti kampus 2 gedung elektro, berisi KTM, KTP dan SIM atas nama Yudianto Panca N.",
    image: "https://placehold.co/400x300/999999/FFFFFF?text=Dompet",
    category: "Accessories",
  },
  {
    id: 2,
    title: "Laptop ASUS",
    location: "Perpustakaan Pusat",
    date: "27 April 2025",
    description:
      "Laptop ASUS warna silver dengan stiker logo programming ditemukan di meja pojok perpustakaan pusat lantai 2.",
    image: "https://placehold.co/400x300/967259/FFFFFF?text=Laptop",
    category: "Electronics",
  },
  {
    id: 3,
    title: "Kunci Motor Honda",
    location: "Parkiran Fakultas Teknik",
    date: "26 April 2025",
    description:
      "Kunci motor Honda dengan gantungan kunci berbentuk ikan ditemukan di area parkir fakultas teknik dekat pos satpam.",
    image: "https://placehold.co/400x300/22cc88/FFFFFF?text=Kunci+Motor",
    category: "Others",
  },
  {
    id: 4,
    title: "Jam Tangan Casio",
    location: "Gedung Olahraga",
    date: "25 April 2025",
    description:
      "Jam tangan merk Casio warna hitam ditemukan di ruang ganti gedung olahraga setelah acara kompetisi basket antar fakultas.",
    image: "https://placehold.co/400x300/333333/FFFFFF?text=Jam+Tangan",
    category: "Accessories",
  },
  {
    id: 5,
    title: "Flashdisk SanDisk 32GB",
    location: "Lab Komputer",
    date: "24 April 2025",
    description:
      "Flashdisk merk SanDisk 32GB warna merah hitam tertinggal di komputer nomor 12 Lab Komputer Fakultas Teknik.",
    image: "https://placehold.co/400x300/FF0000/FFFFFF?text=Flashdisk",
    category: "Electronics",
  },
];

// Sample data for found items - empty since this is the lost items page
const foundItems = [];

const KatalogHilang = () => {
  return (
    <Katalog
      fixedTab="lost"
      showTabs={true}
      pageTitle="Barang Hilang"
      pageDescription="Daftar barang yang hilang dan belum ditemukan. Apakah Anda menemukan salah satu barang ini?"
      lostItems={lostItems}
      foundItems={foundItems}
      categories={[
        "Semua Kategori",
        "Electronics",
        "Documents",
        "Accessories",
        "Stationery",
        "Clothing",
        "Others",
      ]}
    />
  );
};

export default KatalogHilang;