import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFillPersonFill,
  BsCalendarDate,
  BsGeoAlt,
  BsLink45Deg,
  BsXCircleFill,
} from "react-icons/bs";
import { IoAttach, IoImagesOutline } from "react-icons/io5";
import { itemsApi } from "../../services/api";

const FormuliBarangHilang = () => {
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
    tanggalKehilangan: {
      day: "",
      month: "",
      year: "",
    },
    lokasiTerakhir: "",
    hubunganDenganBarang: "",
    dokumenPendukung: null,
    agreement1: false,
    agreement2: false,
  });

  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [slideDirection, setSlideDirection] = useState("right");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setSlideDirection("right");
    setTimeout(() => {
      navigate("/forms-found");
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Buat FormData baru untuk setiap submission
      const formDataToSend = new FormData();
      
      // Data utama sesuai validasi backend
      formDataToSend.append('title', formData.namaBarang.trim());
      formDataToSend.append('description', formData.ciriCiriKhusus.trim());
      formDataToSend.append('location', formData.lokasiTerakhir.trim());
      formDataToSend.append('category', (formData.merk || 'Others').trim());
      formDataToSend.append('type', 'lost');
      formDataToSend.append('date', getFormattedDate());

      // PENTING: Format yang tepat untuk upload gambar di Laravel
      if (formData.fotoBarang.length > 0) {
        // Periksa semua file untuk memastikan format yang valid
        for (let i = 0; i < formData.fotoBarang.length; i++) {
          const file = formData.fotoBarang[i];
          
          // Log file info untuk debug
          console.log(`File ${i}: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
          
          // Periksa tipe file
          if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            alert(`File "${file.name}" bukan gambar dengan format yang valid (JPG/JPEG/PNG)`);
            setIsSubmitting(false);
            return;
          }
          
          // Periksa ukuran file (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
            alert(`File "${file.name}" terlalu besar. Maksimal ukuran file adalah 2MB`);
            setIsSubmitting(false);
            return;
          }
          
          // Gunakan format 'images[]' yang diharapkan Laravel
          formDataToSend.append('images[]', file);
        }
      } else {
        alert("Anda harus menambahkan minimal 1 foto");
        setIsSubmitting(false);
        return;
      }
      
      // Debug: log semua data yang akan dikirim
      console.log("Form data yang akan dikirim:");
      for (const pair of formDataToSend.entries()) {
        const [key, value] = pair;
        if (value instanceof File) {
          console.log(`${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Kirim data ke API
      const response = await itemsApi.create(formDataToSend);
      
      console.log("Form berhasil dikirim:", response.data);
      alert("Laporan barang hilang berhasil dikirim!");
      navigate('/lost-items');
      
    } catch (error) {
      console.error("Terjadi error saat upload:", error);
      
      let errorMessage = "Terjadi kesalahan saat mengirim data.";
      
      // Detailed error reporting
      if (error.response && error.response.data) {
        console.error("Response details:", error.response.data);
        
        if (error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        }
        
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorDetails = [];
          
          for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
              errors[field].forEach(message => {
                errorDetails.push(`- ${field}: ${message}`);
              });
            }
          }
          
          if (errorDetails.length > 0) {
            errorMessage += "\n\nDetail error:\n" + errorDetails.join("\n");
          }
        }
        
        console.error('Final error message:', errorMessage);
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function untuk mendapatkan tanggal dalam format yang benar
  const getFormattedDate = () => {
    if (formData.tanggalKehilangan.day && formData.tanggalKehilangan.month && formData.tanggalKehilangan.year) {
      const day = formData.tanggalKehilangan.day.toString().padStart(2, '0');
      const month = formData.tanggalKehilangan.month.toString().padStart(2, '0');
      const year = formData.tanggalKehilangan.year;
      return `${year}-${month}-${day}`;
    } else {
      // Default tanggal hari ini
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  };
  
  const validateForm = () => {
    // Validasi data form dasar
    if (!formData.namaBarang.trim()) {
      alert("Nama barang wajib diisi");
      return false;
    }
    
    if (!formData.ciriCiriKhusus.trim()) {
      alert("Ciri-ciri khusus barang wajib diisi");
      return false;
    }
    
    if (!formData.namaNickname.trim()) {
      alert("Nama/Nickname wajib diisi");
      return false;
    }
    
    if (!formData.kontak.trim()) {
      alert("Kontak wajib diisi");
      return false;
    }
    
    if (!formData.tanggalKehilangan.day || !formData.tanggalKehilangan.month || !formData.tanggalKehilangan.year) {
      alert("Tanggal kehilangan wajib diisi lengkap");
      return false;
    }
    
    if (!formData.lokasiTerakhir.trim()) {
      alert("Lokasi terakhir terlihat wajib diisi");
      return false;
    }
    
    if (formData.fotoBarang.length === 0) {
      alert("Harap unggah setidaknya satu foto barang");
      return false;
    }
    
    if (!formData.agreement1 || !formData.agreement2) {
      alert("Anda harus menyetujui semua persyaratan");
      return false;
    }
    
    return true;
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
                  Home
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
            {/* Left Section with Illustration */}
            <div
              className={`w-full md:w-2/5 bg-sky-50 p-8 flex flex-col justify-between order-2 md:order-1 transition-all duration-500 transform ${
                isEntering ? "translate-x-full" : "translate-x-0"
              } ${isExiting ? "translate-x-full" : "translate-x-0"}`}
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-slate-800">
                  Formulir Barang Hilang
                </h2>
                <img
                  src="/banyak-orang.svg"
                  alt="Ilustrasi Pencarian"
                  className="w-full h-auto max-h-80 object-contain"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-700">
                    Menemukan barang hilang?
                  </h3>
                  <p className="text-slate-600">
                    Yuk, bantu laporkan melalui formulir berikut.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleChangeForm}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    Formulir Barang Ditemukan
                  </button>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-800 text-sm">
                  Dengan Melanjutkan, Anda Memperbesar Peluang Barang Anda
                  Ditemukan Dan Dikembalikan. Terima Kasih Telah Melaporkan
                  Kehilangan Ini—Semoga Segera Ditemukan!
                </p>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="w-full md:w-3/5 p-8 order-1 md:order-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">
                    Informasi Barang Hilang
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
                        Tanggal Kehilangan
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          name="tanggalKehilangan.day"
                          value={formData.tanggalKehilangan.day}
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
                          name="tanggalKehilangan.month"
                          value={formData.tanggalKehilangan.month}
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
                          name="tanggalKehilangan.year"
                          value={formData.tanggalKehilangan.year}
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
                        htmlFor="lokasiTerakhir"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Lokasi Terakhir Terlihat
                      </label>
                      <input
                        type="text"
                        id="lokasiTerakhir"
                        name="lokasiTerakhir"
                        value={formData.lokasiTerakhir}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="hubunganDenganBarang"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Hubungan Dengan Barang
                      </label>
                      <input
                        type="text"
                        id="hubunganDenganBarang"
                        name="hubunganDenganBarang"
                        value={formData.hubunganDenganBarang}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Dokumen Pendukung
                      </label>
                      <div className="flex items-center">
                        <label
                          htmlFor="dokumenPendukung"
                          className="flex items-center justify-center px-4 py-2 bg-slate-100 rounded-lg border border-slate-300 cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                          <IoAttach className="mr-2" />
                          <span>Lampirkan File</span>
                          <input
                            type="file"
                            id="dokumenPendukung"
                            name="dokumenPendukung"
                            onChange={handleInputChange}
                            className="hidden"
                          />
                        </label>
                        <span className="ml-3 text-sm text-slate-500">
                          {formData.dokumenPendukung
                            ? formData.dokumenPendukung.name
                            : "Belum ada file dipilih"}
                        </span>
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
                        keperluan pencarian barang
                      </label>
                    </div>
                  </div>
                </section>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 ${
                      isSubmitting 
                        ? "bg-blue-400 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700"
                    } rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FormuliBarangHilang;
