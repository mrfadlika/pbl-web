import React from "react";
import Katalog from "..";
import { useKatalogData } from "../Katalog.hooks";

const KatalogHilang = () => {
  // Menggunakan hooks untuk data
  const { loading, error, lostItems } = useKatalogData('lost');
  
  return (
    <Katalog
      fixedTab="lost"
      showTabs={true}
      pageTitle="Barang Hilang"
      pageDescription="Daftar barang yang hilang dan belum ditemukan. Apakah Anda menemukan salah satu barang ini?"
      lostItems={lostItems}
      foundItems={[]}
    />
  );
};

export default KatalogHilang;