import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoAttach,
  IoLocation,
  IoCalendar,
  IoPersonCircle,
  IoImagesOutline,
} from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { BsXCircleFill } from "react-icons/bs";

const FormuliBarangDitemukan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaBarang: "",
    merk: "",
    warna: "",
    ciriCiriKhusus: "",
    fotoBarang: [],
    namaNickname: "",
    isAnonymous: false,
    kontak: "",
    tanggalDitemukan: {
      day: "",
      month: "",
      year: "",
    },
    lokasiDitemukan: "",
    barangDisimpanDengan: "",
    agreement1: false,
    agreement2: false,
  });

  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");

  useEffect(() => {
    // Animasi saat halaman pertama kali dimuat
    setTimeout(() => {
      setIsEntering(false);
    }, 10);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file" && name === "fotoBarang") {
      // Batas maksimal 3 foto
      if (formData.fotoBarang.length + files.length > 3) {
        alert("Maksimal 3 foto yang diperbolehkan");
        return;
      }

      const newFiles = Array.from(files);

      // Tambahkan file baru ke state
      setFormData((prev) => ({
        ...prev,
        fotoBarang: [...prev.fotoBarang, ...newFiles],
      }));

      // Buat URL previews untuk file baru
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFotoPreviews((prev) => [...prev, ...newPreviews]);
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveFoto = (index) => {
    // Hapus URL dari preview
    URL.revokeObjectURL(fotoPreviews[index]);

    // Hapus foto dari state
    setFormData((prev) => ({
      ...prev,
      fotoBarang: prev.fotoBarang.filter((_, i) => i !== index),
    }));

    // Hapus dari preview state
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeForm = () => {
    setIsExiting(true);
    setSlideDirection("left");
    setTimeout(() => {
      navigate("/forms-lost");
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Kirim data ke backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white font-sans">
      {/* Header/Navbar */}
      <header className="bg-sky-50 shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-blue-600 font-bold text-2xl">
              <img
                src="/logo_wak.png"
                alt="Lost & Found Logo"
                className="h-20 w-auto"
              />
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-slate-800 hover:text-blue-600 transition-colors"
                >
                  List
                </Link>
              </li>
              <li>
                <Link
                  to="/minfess"
                  className="text-slate-800 hover:text-blue-600 transition-colors"
                >
                  Minfess
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden my-8">
          <div className="flex flex-col md:flex-row">
            {/* Main Form Area (Left side) */}
            <div className="w-full md:w-3/5 p-8 order-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    Informasi Barang Ditemukan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="namaBarang"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Nama Barang
                      </label>
                      <input
                        type="text"
                        id="namaBarang"
                        name="namaBarang"
                        value={formData.namaBarang}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="merk"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Merk (Jika ada)
                      </label>
                      <input
                        type="text"
                        id="merk"
                        name="merk"
                        value={formData.merk}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="warna"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Warna
                      </label>
                      <input
                        type="text"
                        id="warna"
                        name="warna"
                        value={formData.warna}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="ciriCiriKhusus"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Ciri-Ciri Khusus
                      </label>
                      <textarea
                        id="ciriCiriKhusus"
                        name="ciriCiriKhusus"
                        value={formData.ciriCiriKhusus}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Foto Barang (Maksimal 3 Foto)
                      </label>
                      <div className="flex items-center">
                        <label
                          htmlFor="fotoBarang"
                          className="flex items-center justify-center px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                          <IoImagesOutline className="mr-2" />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            id="fotoBarang"
                            name="fotoBarang"
                            onChange={handleInputChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                          />
                        </label>
                        <span className="ml-3 text-sm text-slate-500">
                          {formData.fotoBarang.length > 0
                            ? `${formData.fotoBarang.length} foto dipilih`
                            : "Belum ada foto dipilih (Maks. 3)"}
                        </span>
                      </div>

                      {fotoPreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {fotoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg border border-slate-300"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFoto(index)}
                                className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1 text-red-500 hover:text-red-700 transform transition-transform hover:scale-110"
                              >
                                <BsXCircleFill size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    Identitasi Pelapor
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="namaNickname"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Nama/Nickname
                      </label>
                      <input
                        type="text"
                        id="namaNickname"
                        name="namaNickname"
                        value={formData.namaNickname}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-4">
                        <span className="block text-sm font-medium text-slate-700">
                          Ingin tetap anonim?
                        </span>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="isAnonymous"
                              checked={formData.isAnonymous}
                              onChange={() =>
                                setFormData({ ...formData, isAnonymous: true })
                              }
                              className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">
                              Ya
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="isAnonymous"
                              checked={!formData.isAnonymous}
                              onChange={() =>
                                setFormData({ ...formData, isAnonymous: false })
                              }
                              className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">
                              Tidak
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="kontak"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Kontak yang dapat dihubungi
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                          +62
                        </span>
                        <input
                          type="text"
                          id="kontak"
                          name="kontak"
                          value={formData.kontak}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 rounded-r-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    Detail Tambahan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Tanggal Ditemukan
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          name="tanggalDitemukan.day"
                          value={formData.tanggalDitemukan.day}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">DD</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="tanggalDitemukan.month"
                          value={formData.tanggalDitemukan.month}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">MM</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="tanggalDitemukan.year"
                          value={formData.tanggalDitemukan.year}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">YYYY</option>
                          {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lokasiDitemukan"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Lokasi Ditemukan
                      </label>
                      <input
                        type="text"
                        id="lokasiDitemukan"
                        name="lokasiDitemukan"
                        value={formData.lokasiDitemukan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="barangDisimpanDengan"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Barang Disimpan Sama Siapa?
                      </label>
                      <div className="relative">
                        <select
                          id="barangDisimpanDengan"
                          name="barangDisimpanDengan"
                          value={formData.barangDisimpanDengan}
                          onChange={handleInputChange}
                          className="appearance-none w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        >
                          <option value="">Pilih</option>
                          <option value="saya">Saya sendiri</option>
                          <option value="petugas">Petugas keamanan</option>
                          <option value="kantorInformasi">
                            Kantor informasi
                          </option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <FiChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreement1"
                        name="agreement1"
                        checked={formData.agreement1}
                        onChange={handleInputChange}
                        className="h-4 w-4 mt-1 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="agreement1"
                        className="ml-2 block text-sm text-slate-700"
                      >
                        Saya menyatakan bahwa data yang saya isi benar
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreement2"
                        name="agreement2"
                        checked={formData.agreement2}
                        onChange={handleInputChange}
                        className="h-4 w-4 mt-1 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="agreement2"
                        className="ml-2 block text-sm text-slate-700"
                      >
                        Saya setuju informasi ini disimpan dan ditampilkan untuk
                        keperluan pencarian pemilik barang
                      </label>
                    </div>
                  </div>
                </section>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Right Section with Illustration */}
            <div
              className={`w-full md:w-2/5 bg-sky-50 p-8 flex flex-col justify-between order-2 transition-all duration-500 transform ${
                isEntering ? "translate-x-full" : "translate-x-0"
              } ${isExiting ? "translate-x-full" : "translate-x-0"}`}
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">
                  Formulir Barang Ditemukan
                </h2>
                <img
                  src="/banyak-orang.svg"
                  alt="Ilustrasi Pencarian"
                  className="w-full h-auto max-h-80 object-contain"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-700">
                    Kehilangan barang?
                  </h3>
                  <p className="text-slate-600">
                    Yuk, laporkan melalui formulir berikut.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleChangeForm}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    Formulir Barang Hilang
                  </button>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-800 text-sm">
                  Dengan Melanjutkan, Anda Membantu Seseorang Mendapatkan
                  Barangnya Kembali. Terima Kasih Telah Melaporkan Penemuan
                  Ini—Semoga Segera Bertemu Dengan Pemiliknya!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormuliBarangDitemukan;
