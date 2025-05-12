const FooterGlobal = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg overflow-visible">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-3/5 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">
              Kehilangan Barang? Atau Menemukan Barang Orang?
            </h2>
            <p className="text-blue-100 mb-6">
              Laporkan sekarang juga dan bantu sesama menemukan kembali barang
              berharganya.Siapa tahu, hari ini kamu jadi pahlawan kecil buat
              orang lain!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md">
                Laporkan Kehilangan Barang
              </button>
              <button className="bg-blue-800 text-white hover:bg-blue-900 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md border border-blue-700">
                Laporkan Menemukan Barang
              </button>
            </div>
          </div>

          {/* Image Container - Absolute positioned to allow overflow */}
          <div className="md:w-2/5 relative">
            <div className="absolute right-0 md:-top-50 md:-right-12 lg:-right-50 xl:-right-50 w-full h-full">
              <img
                src="/orang.svg"
                alt="Illustration of person with magnifying glass"
                className="h-64 md:h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FooterGlobal;
