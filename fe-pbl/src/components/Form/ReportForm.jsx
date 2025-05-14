import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IoAttach,
  IoLocation,
  IoCalendar,
  IoImagesOutline,
  IoPerson,
} from "react-icons/io5";
import { BsXCircleFill } from "react-icons/bs";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

const ReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get data from query params
  const itemId = queryParams.get('id') || '';
  const itemTitle = queryParams.get('title') || '';
  const itemCategory = queryParams.get('category') || '';
  const itemLocation = queryParams.get('location') || '';
  const itemDate = queryParams.get('date') || '';

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
    proofDescription: "",
    proofImages: [],
    ownerDescription: "",
    whenSeen: {
      day: "",
      month: "",
      year: "",
    },
    whereSeen: "",
    additionalInfo: "",
    agreement: false,
    purchaseDate: "",
    purchaseLocation: "",
    hiddenDetails: "",
    witness: "",
  });

  const [fotoPreviews, setFotoPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file" && name === "proofImages") {
      // Batas maksimal 3 foto
      if (files.length > 3) {
        setErrors(prev => ({
          ...prev,
          proofImages: "Maksimal 3 foto yang diperbolehkan"
        }));
        return;
      }
      
      if (files.length < 3) {
        setErrors(prev => ({
          ...prev,
          proofImages: "Minimal 3 foto diperlukan sebagai bukti"
        }));
        return;
      }

      // Hapus error jika sudah valid
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.proofImages;
        return newErrors;
      });

      const newFiles = Array.from(files);

      // Tambahkan file baru ke state
      setFormData((prev) => ({
        ...prev,
        proofImages: newFiles,
      }));

      // Buat URL previews untuk file baru
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      // Hapus preview lama
      fotoPreviews.forEach(url => URL.revokeObjectURL(url));
      
      // Set preview baru
      setFotoPreviews(newPreviews);
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
    const newProofImages = [...formData.proofImages];
    newProofImages.splice(index, 1);
    
    setFormData((prev) => ({
      ...prev,
      proofImages: newProofImages,
    }));

    // Hapus dari preview state
    const newPreviews = [...fotoPreviews];
    newPreviews.splice(index, 1);
    setFotoPreviews(newPreviews);
    
    // Set error jika kurang dari 3 foto
    if (newProofImages.length < 3) {
      setErrors(prev => ({
        ...prev,
        proofImages: "Minimal 3 foto diperlukan sebagai bukti"
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = "Kontak wajib diisi";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Pesan wajib diisi";
    }
    
    if (!formData.proofDescription.trim()) {
      newErrors.proofDescription = "Deskripsi bukti wajib diisi";
    }
    
    if (formData.proofImages.length < 3) {
      newErrors.proofImages = "Minimal 3 foto diperlukan sebagai bukti";
    }
    
    if (!formData.ownerDescription.trim()) {
      newErrors.ownerDescription = "Deskripsi pemilik barang wajib diisi";
    }
    
    if (!formData.agreement) {
      newErrors.agreement = "Anda harus menyetujui persyaratan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulasi pengiriman ke backend (ganti dengan API call sesungguhnya)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", {
        itemId,
        itemCategory,
        formData
      });
      
      setSubmitSuccess(true);
      
      // Redirect ke halaman detail setelah beberapa detik
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({
        ...prev,
        submit: "Terjadi kesalahan saat mengirim data. Silakan coba lagi."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans">
      {/* Header/Navbar */}
      <header className="bg-blue-50 shadow-sm py-4">
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
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/lost-items"
                  className="text-slate-800 hover:text-blue-600 transition-colors"
                >
                  Barang Hilang
                </Link>
              </li>
              <li>
                <Link
                  to="/found-items"
                  className="text-slate-800 hover:text-blue-600 transition-colors"
                >
                  Barang Ditemukan
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {submitSuccess ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">Laporan Berhasil Dikirim!</h2>
            <p className="text-gray-600 mt-3">Laporan tentang pemilik barang telah berhasil dikirim. Tim kami akan memeriksa laporan Anda dan menghubungi Anda melalui kontak yang diberikan.</p>
            <p className="text-gray-500 mt-6">Anda akan dialihkan ke halaman utama dalam beberapa detik...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden my-8">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Laporan Pemilik Barang</h2>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IoImagesOutline className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{itemTitle}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <IoLocation className="mr-1" /> {itemLocation} • <IoCalendar className="mx-1" /> {itemDate}
                  </div>
                </div>
              </div>
              
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Data Diri Pelapor
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1 error-message">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                        Kontak (No. HP/Email) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {errors.contact && <p className="text-red-500 text-sm mt-1 error-message">{errors.contact}</p>}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Bukti & Informasi Pemilik
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Jelaskan mengapa Anda yakin barang ini milik Anda, kapan dan di mana Anda kehilangan barang ini."
                        className={`w-full px-4 py-2 rounded-lg border ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      ></textarea>
                      {errors.message && <p className="text-red-500 text-sm mt-1 error-message">{errors.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="proofDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi Bukti <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="proofDescription"
                        name="proofDescription"
                        value={formData.proofDescription}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Jelaskan bukti-bukti yang menunjukkan bahwa barang ini milik Anda (misalnya: tanda khusus, goresan, stiker, konten di dalamnya, dll)."
                        className={`w-full px-4 py-2 rounded-lg border ${errors.proofDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      ></textarea>
                      {errors.proofDescription && <p className="text-red-500 text-sm mt-1 error-message">{errors.proofDescription}</p>}
                    </div>

                    <div>
                      <label htmlFor="ownerDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi Pemilik Barang <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="ownerDescription"
                        name="ownerDescription"
                        value={formData.ownerDescription}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Deskripsikan ciri-ciri pemilik barang, nama, atau informasi lain yang dapat mengidentifikasi pemilik"
                        className={`w-full px-4 py-2 rounded-lg border ${errors.ownerDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      ></textarea>
                      {errors.ownerDescription && <p className="text-red-500 text-sm mt-1 error-message">{errors.ownerDescription}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto Bukti (Wajib 3 Foto) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Unggah 3 foto sebagai bukti (foto pemilik dengan barang tersebut, foto interaksi, atau bukti lainnya)
                      </p>
                      <div className="flex items-center">
                        <label
                          htmlFor="proofImages"
                          className="flex items-center justify-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                          <IoImagesOutline className="mr-2" />
                          <span>Pilih 3 Foto</span>
                          <input
                            type="file"
                            id="proofImages"
                            name="proofImages"
                            onChange={handleInputChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                            required
                          />
                        </label>
                        <span className={`ml-3 text-sm ${errors.proofImages ? 'text-red-500' : 'text-gray-500'}`}>
                          {formData.proofImages.length > 0
                            ? `${formData.proofImages.length} foto dipilih ${formData.proofImages.length < 3 ? '(Wajib 3)' : ''}`
                            : "Belum ada foto dipilih (Wajib 3)"}
                        </span>
                      </div>
                      {errors.proofImages && <p className="text-red-500 text-sm mt-1 error-message">{errors.proofImages}</p>}

                      {fotoPreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {fotoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg border border-gray-300"
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
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Informasi Tambahan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Waktu Melihat Pemilik (Opsional)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          name="whenSeen.day"
                          value={formData.whenSeen.day}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">DD</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="whenSeen.month"
                          value={formData.whenSeen.month}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">MM</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select
                          name="whenSeen.year"
                          value={formData.whenSeen.year}
                          onChange={handleInputChange}
                          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">YYYY</option>
                          {[...Array(10)].map((_, i) => {
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
                        htmlFor="whereSeen"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Lokasi Melihat Pemilik (Opsional)
                      </label>
                      <input
                        type="text"
                        id="whereSeen"
                        name="whereSeen"
                        value={formData.whereSeen}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="additionalInfo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Informasi Tambahan (Opsional)
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Informasi tambahan yang mungkin membantu mengidentifikasi pemilik barang"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                  </div>
                </section>

                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Detail Tambahan Kepemilikan
                  </label>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <InputField
                      label="Tanggal Pembelian / Perolehan"
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      placeholder="Kapan Anda membeli atau memperoleh barang ini"
                      value={formData.purchaseDate || ""}
                      onChange={handleInputChange}
                    />
                    
                    <InputField
                      label="Lokasi atau Toko Pembelian"
                      id="purchaseLocation"
                      name="purchaseLocation"
                      placeholder="Di mana Anda membeli atau memperoleh barang ini"
                      value={formData.purchaseLocation || ""}
                      onChange={handleInputChange}
                    />
                    
                    <TextAreaField
                      label="Ciri Khusus / Detail Tersembunyi"
                      id="hiddenDetails"
                      name="hiddenDetails"
                      placeholder="Jelaskan detail tersembunyi/ciri khusus yang hanya diketahui pemilik (contoh: password, konten spesifik, kerusakan tertentu)"
                      value={formData.hiddenDetails || ""}
                      onChange={handleInputChange}
                      rows={2}
                    />
                    
                    <InputField
                      label="Saksi / Referensi (Opsional)"
                      id="witness"
                      name="witness"
                      placeholder="Nama dan kontak orang yang dapat mengkonfirmasi kepemilikan Anda"
                      value={formData.witness || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="agreement"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleInputChange}
                      className={`h-5 w-5 mt-1 rounded border ${errors.agreement ? 'border-red-300 bg-red-50' : 'border-gray-300'} text-blue-600 focus:ring-blue-500`}
                    />
                    <label
                      htmlFor="agreement"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Saya menyatakan bahwa semua informasi yang saya berikan adalah benar, dan saya bersedia dihubungi untuk verifikasi lebih lanjut. Saya memahami bahwa laporan palsu dapat dikenakan sanksi.
                    </label>
                  </div>
                  {errors.agreement && <p className="text-red-500 text-sm mb-4 error-message">{errors.agreement}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Laporan Pemilik'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportForm;