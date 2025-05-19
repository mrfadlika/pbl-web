import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IoAttach,
  IoLocation,
  IoCalendar,
  IoImagesOutline,
} from "react-icons/io5";
import { BsXCircleFill } from "react-icons/bs";
import { reportsApi } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

const ClaimForm = () => {
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
    proofDocuments: null,
    foundDate: {
      day: "",
      month: "",
      year: "",
    },
    foundLocation: "",
    uniqueFeatures: "",
    additionalInfo: "",
    agreement: false,
    foundTime: "",
    specificLocation: "",
    triedContact: "",
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
      newErrors.message = "Deskripsi penemuan wajib diisi";
    }
    
    if (!formData.proofDescription.trim()) {
      newErrors.proofDescription = "Kondisi barang wajib diisi";
    }
    
    if (formData.proofImages.length < 3) {
      newErrors.proofImages = "Minimal 3 foto barang diperlukan";
    }
    
    if (!formData.uniqueFeatures.trim()) {
      newErrors.uniqueFeatures = "Ciri khusus barang wajib diisi";
    }
    
    if (!formData.specificLocation || !formData.specificLocation.trim()) {
      newErrors.specificLocation = "Lokasi penemuan spesifik wajib diisi";
    }
    
    if (!formData.foundTime) {
      newErrors.foundTime = "Waktu penemuan wajib diisi";
    }
    
    if (!formData.triedContact) {
      newErrors.triedContact = "Silakan pilih apakah Anda sudah mencoba menghubungi pemilik";
    }
    
    if (!formData.agreement) {
      newErrors.agreement = "Anda harus menyetujui persyaratan";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function untuk mendapatkan tanggal dalam format yang benar untuk API
  const getFormattedDate = (dateObj) => {
    if (dateObj.day && dateObj.month && dateObj.year) {
      const day = dateObj.day.toString().padStart(2, '0');
      const month = dateObj.month.toString().padStart(2, '0');
      const year = dateObj.year;
      return `${year}-${month}-${day}`;
    }
    return null;
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
      // Buat FormData untuk mengirim data termasuk file
      const reportFormData = new FormData();
      
      // Tambahkan data ke FormData
      reportFormData.append('item_id', itemId);
      reportFormData.append('userName', formData.name);
      reportFormData.append('contact', formData.contact);
      reportFormData.append('message', formData.message);
      reportFormData.append('proofDescription', formData.proofDescription);
      reportFormData.append('report_type', 'found'); // Mengindikasikan ini laporan penemuan
      reportFormData.append('additional_info', formData.additionalInfo || '');
      
      // Format tanggal dengan benar menggunakan helper function
      const foundDate = getFormattedDate(formData.foundDate);
      if (foundDate) {
        reportFormData.append('found_date', foundDate);
      }
      
      // Tambahkan informasi lain yang mungkin diperlukan
      if (formData.foundTime) {
        reportFormData.append('found_time', formData.foundTime);
      }
      
      if (formData.specificLocation) {
        reportFormData.append('specific_location', formData.specificLocation);
      }
      
      if (formData.uniqueFeatures) {
        reportFormData.append('unique_features', formData.uniqueFeatures);
      }
      
      if (formData.witness) {
        reportFormData.append('witness', formData.witness);
      }
      
      if (formData.triedContact) {
        reportFormData.append('tried_contact', formData.triedContact);
      }
      
      // Tambahkan foto bukti
      formData.proofImages.forEach((file, index) => {
        reportFormData.append(`proofImages[${index}]`, file);
      });
      
      // Tambahkan dokumen pendukung jika ada
      if (formData.proofDocuments) {
        reportFormData.append('proofDocuments', formData.proofDocuments);
      }
      
      // Kirim data ke API
      const response = await reportsApi.create(reportFormData);
      
      console.log("Report submitted successfully:", response.data);
      
      setSubmitSuccess(true);
      
      // Redirect ke halaman detail setelah beberapa detik
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || "Terjadi kesalahan saat mengirim data. Silakan coba lagi."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white font-sans">
      {/* Header/Navbar */}
      <header className="bg-amber-50 shadow-sm py-4">
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
            <h2 className="text-2xl font-bold text-gray-800 mt-6">Laporan Penemuan Berhasil Dikirim!</h2>
            <p className="text-gray-600 mt-3">Laporan penemuan barang telah berhasil dikirim. Tim kami akan memeriksa laporan Anda dan menghubungi pemilik jika ada yang mengklaim barang tersebut.</p>
            <p className="text-gray-500 mt-6">Anda akan dialihkan ke halaman utama dalam beberapa detik...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden my-8">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Laporan Penemuan Barang</h2>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IoImagesOutline className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{itemTitle}</h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <IoLocation className="mr-1" /> {itemLocation} • <IoCalendar className="mx-1" /> {formatDate(itemDate, 'medium')}
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
                    Data Diri Penemu
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
                        className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
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
                        className={`w-full px-4 py-2 rounded-lg border ${errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      />
                      {errors.contact && <p className="text-red-500 text-sm mt-1 error-message">{errors.contact}</p>}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Detail Penemuan Barang
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi Penemuan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Jelaskan bagaimana Anda menemukan barang ini, kondisi saat ditemukan, dll."
                        className={`w-full px-4 py-2 rounded-lg border ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      ></textarea>
                      {errors.message && <p className="text-red-500 text-sm mt-1 error-message">{errors.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="proofDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Kondisi Barang <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="proofDescription"
                        name="proofDescription"
                        value={formData.proofDescription}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Jelaskan kondisi barang saat ditemukan (kerusakan, tingkat kebersihan, keadaan umum, dll)."
                        className={`w-full px-4 py-2 rounded-lg border ${errors.proofDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      ></textarea>
                      {errors.proofDescription && <p className="text-red-500 text-sm mt-1 error-message">{errors.proofDescription}</p>}
                    </div>

                    <div>
                      <label htmlFor="uniqueFeatures" className="block text-sm font-medium text-gray-700 mb-1">
                        Ciri Khusus Barang <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="uniqueFeatures"
                        name="uniqueFeatures"
                        value={formData.uniqueFeatures}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Jelaskan ciri khusus pada barang yang dapat membantu mengidentifikasi pemiliknya (stiker, tulisan, warna, dll)."
                        className={`w-full px-4 py-2 rounded-lg border ${errors.uniqueFeatures ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      ></textarea>
                      {errors.uniqueFeatures && <p className="text-red-500 text-sm mt-1 error-message">{errors.uniqueFeatures}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto Barang (Wajib 3 Foto) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Unggah 3 foto yang menunjukkan barang yang ditemukan dari berbagai sudut untuk membantu pemilik mengidentifikasi barangnya
                      </p>
                      <div className="flex items-center">
                        <label
                          htmlFor="proofImages"
                          className="flex items-center justify-center px-4 py-2 bg-amber-50 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
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

                    <div>
                      <label htmlFor="proofDocuments" className="block text-sm font-medium text-gray-700 mb-1">
                        Dokumen Pendukung (Opsional)
                      </label>
                      <p className="text-sm text-gray-600 mb-2">
                        Unggah dokumen pendukung seperti surat keterangan penemuan atau bukti lain yang relevan
                      </p>
                      <div className="flex items-center">
                        <label
                          htmlFor="proofDocuments"
                          className="flex items-center justify-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <IoAttach className="mr-2" />
                          <span>Pilih Dokumen</span>
                          <input
                            type="file"
                            id="proofDocuments"
                            name="proofDocuments"
                            onChange={handleInputChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {formData.proofDocuments
                            ? formData.proofDocuments.name
                            : "Belum ada dokumen dipilih"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Informasi Tambahan Tentang Penemuan
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="foundTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Waktu Penemuan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="foundTime"
                        name="foundTime"
                        value={formData.foundTime || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="specificLocation" className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasi Penemuan Spesifik <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="specificLocation"
                        name="specificLocation"
                        value={formData.specificLocation || ""}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Jelaskan detail lokasi penemuan (misalnya: di bawah kursi baris ke-3, dekat pintu masuk timur, dll)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apakah Anda sudah berusaha menghubungi pemilik? <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="contactYes"
                            name="triedContact"
                            value="yes"
                            checked={formData.triedContact === "yes"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                            required
                          />
                          <label htmlFor="contactYes" className="ml-2 text-gray-700">
                            Ya, saya sudah mencoba
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="contactNo"
                            name="triedContact"
                            value="no"
                            checked={formData.triedContact === "no"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                          />
                          <label htmlFor="contactNo" className="ml-2 text-gray-700">
                            Tidak, saya belum mencoba
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="witness" className="block text-sm font-medium text-gray-700 mb-1">
                        Saksi Penemuan (Opsional)
                      </label>
                      <input
                        type="text"
                        id="witness"
                        name="witness"
                        value={formData.witness || ""}
                        onChange={handleInputChange}
                        placeholder="Nama dan kontak orang yang menyaksikan Anda menemukan barang ini"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                        Informasi Tambahan (Opsional)
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Informasi tambahan tentang penemuan yang mungkin membantu dalam identifikasi pemilik atau kondisi barang"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                    </div>
                  </div>
                </section>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="agreement"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleInputChange}
                      className={`h-5 w-5 mt-1 rounded border ${errors.agreement ? 'border-red-300 bg-red-50' : 'border-gray-300'} text-amber-600 focus:ring-amber-500`}
                    />
                    <label
                      htmlFor="agreement"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Saya menyatakan bahwa semua informasi yang saya berikan adalah benar, dan saya bersedia dihubungi untuk verifikasi lebih lanjut. Saya memahami bahwa klaim palsu dapat dikenakan sanksi.
                    </label>
                  </div>
                  {errors.agreement && <p className="text-red-500 text-sm mb-4 error-message">{errors.agreement}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 ${isSubmitting ? 'bg-amber-300' : 'bg-amber-500 hover:bg-amber-600'} rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex justify-center items-center`}
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
                      'Kirim Laporan Penemuan'
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

export default ClaimForm;