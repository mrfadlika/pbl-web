import React from "react";
import Katalog from "..";
import { useKatalogData } from "../Katalog.hooks";

const KatalogDitemukan = () => {
  // Menggunakan hooks untuk data
  const { loading, error, foundItems } = useKatalogData('found');
  
  return (
    <Katalog
      fixedTab="found"
      showTabs={true}
      pageTitle="Barang Ditemukan"
      pageDescription="Daftar barang yang telah ditemukan dan menunggu pemiliknya"
      lostItems={[]}
      foundItems={foundItems}
    />
  );
};

export default KatalogDitemukan;