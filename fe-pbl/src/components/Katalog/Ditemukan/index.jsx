import React from "react";
import Katalog from "..";

// Sample data for lost items - empty since this is the found items page
const lostItems = [];

// Sample data for found items
const foundItems = [
  {
    id: 1,
    title: "AirPods Pro",
    location: "Kafetaria Utama",
    date: "28 April 2025",
    description:
      "AirPods Pro dalam case putih ditemukan di meja kafetaria utama dekat konter minuman. Sudah diamankan oleh petugas kafetaria.",
    image: "https://placehold.co/400x300/333333/FFFFFF?text=Airpods",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Kartu Tanda Mahasiswa",
    location: "Gedung Administrasi",
    date: "27 April 2025",
    description:
      "KTM atas nama Indah Permata dari Fakultas Psikologi ditemukan di lorong gedung administrasi lantai 2.",
    image: "https://placehold.co/400x300/22cc88/FFFFFF?text=KTM",
    category: "Documents",
  },
  {
    id: 3,
    title: "Buku Catatan",
    location: "Ruang Kelas E305",
    date: "26 April 2025",
    description:
      "Buku catatan sampul biru berisi catatan mata kuliah Algoritma dan Pemrograman ditemukan tertinggal di meja paling belakang.",
    image: "https://placehold.co/400x300/967259/FFFFFF?text=Notebook",
    category: "Stationery",
  },
  {
    id: 4,
    title: "Payung Lipat",
    location: "Shelter Bus Kampus",
    date: "25 April 2025",
    description:
      "Payung lipat warna navy ditemukan di shelter bus kampus setelah hujan sore kemarin. Kondisi masih bagus.",
    image: "https://placehold.co/400x300/999999/FFFFFF?text=Payung",
    category: "Others",
  },
  {
    id: 5,
    title: "Jaket Denim",
    location: "Ruang Seminar Lt.3",
    date: "24 April 2025",
    description: 
      "Jaket denim biru tertinggal di kursi belakang setelah acara seminar karir kemarin sore. Ada pin fakultas teknik di bagian lengan.",
    image: "https://placehold.co/400x300/0000FF/FFFFFF?text=Jaket",
    category: "Clothing",
  },
];

const KatalogDitemukan = () => {
  return (
    <Katalog
      fixedTab="found"
      showTabs={true}
      pageTitle="Barang Ditemukan"
      pageDescription="Daftar barang yang telah ditemukan dan menunggu untuk diambil pemiliknya. Apakah salah satu barang ini milik Anda?"
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

export default KatalogDitemukan;