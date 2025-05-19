import React, { useState } from 'react';
import { Upload, Calendar, MapPin, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { itemsApi } from '../../services/api';

const FoundItemForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    brand: '',
    color: '',
    characteristics: '',
    images: [],
    finderName: '',
    isAnonymous: false,
    foundDate: '',
    foundLocation: '',
    itemCondition: '',
    additionalNotes: '',
    agreement: false
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(imagePreview[index]);
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.itemName.trim()) {
      alert("Nama barang harus diisi");
      return;
    }
    
    if (!formData.foundLocation.trim()) {
      alert("Lokasi penemuan harus diisi");
      return;
    }
    
    if (!formData.foundDate) {
      alert("Tanggal penemuan harus diisi");
      return;
    }
    
    if (formData.images.length === 0) {
      alert("Harap unggah minimal 1 foto barang");
      return;
    }
    
    if (!formData.agreement) {
      alert("Anda harus menyetujui syarat dan ketentuan");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Siapkan FormData
      const formDataToSend = new FormData();
      
      // Data barang
      formDataToSend.append("title", formData.itemName);
      formDataToSend.append("description", formData.characteristics);
      formDataToSend.append("type", "found");
      formDataToSend.append("category", formData.brand || "Lainnya");
      formDataToSend.append("color", formData.color);
      formDataToSend.append("location", formData.foundLocation);
      formDataToSend.append("date", formData.foundDate);
      
      // Data penemu
      formDataToSend.append("finder_name", formData.finderName);
      formDataToSend.append("is_anonymous", formData.isAnonymous ? 1 : 0);
      
      // Kondisi barang
      if (formData.itemCondition) {
        formDataToSend.append("item_condition", formData.itemCondition);
      }
      
      // Catatan tambahan
      if (formData.additionalNotes) {
        formDataToSend.append("additional_notes", formData.additionalNotes);
      }
      
      // Gambar (upload semua)
      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('images[]', formData.images[i]);
      }
      
      console.log("Mengirim data form:", Object.fromEntries(formDataToSend));
      
      // Kirim data ke API
      const response = await itemsApi.create(formDataToSend);
      console.log("Berhasil mengirim laporan:", response.data);
      
      alert("Terima kasih! Laporan barang ditemukan berhasil dikirim.");
      navigate("/found-items");
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      let errorMessage = "Terjadi kesalahan saat mengirim data. Silakan coba lagi.";
      
      if (error.response) {
        console.error("Response error:", error.response.data);
        
        // Deteksi error validasi dari Laravel (422)
        if (error.response.status === 422 && error.response.data.errors) {
          const validationErrors = Object.values(error.response.data.errors).flat().join("\n");
          errorMessage = `Validasi gagal:\n${validationErrors}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Formulir Barang Ditemukan</h2>
              <p className="mt-2 text-gray-600">Lengkapi informasi di bawah ini untuk melaporkan barang yang ditemukan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informasi Barang Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <AlertCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Informasi Barang</h3>
                    <p className="text-sm text-gray-500">Berikan informasi detail tentang barang yang ditemukan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama/Jenis Barang</label>
                    <input
                      type="text"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Contoh: Dompet Kulit"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Merk (Jika ada)</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Contoh: -"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warna</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Contoh: Coklat Tua"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Ciri-Ciri Khusus</label>
                    <textarea
                      name="characteristics"
                      value={formData.characteristics}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Deskripsikan ciri-ciri khusus barang yang ditemukan"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Foto Barang</label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 ${
                      dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop foto di sini atau{' '}
                        <span className="text-emerald-600 hover:text-emerald-500">pilih file</span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Penemuan Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Detail Penemuan</h3>
                    <p className="text-sm text-gray-500">Informasi tentang lokasi dan waktu penemuan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Ditemukan</label>
                    <input
                      type="date"
                      name="foundDate"
                      value={formData.foundDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Lokasi Penemuan</label>
                    <input
                      type="text"
                      name="foundLocation"
                      value={formData.foundLocation}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Contoh: Gedung A Lantai 2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Kondisi Barang</label>
                    <textarea
                      name="itemCondition"
                      value={formData.itemCondition}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Deskripsikan kondisi barang saat ditemukan"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Catatan Tambahan</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Informasi tambahan yang mungkin berguna"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement Section */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label className="text-sm text-gray-600">
                      Saya menyatakan bahwa data yang saya isi benar dan setuju informasi ini ditampilkan untuk keperluan pencarian pemilik barang
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!formData.agreement || isSubmitting}
                  className={`px-8 py-3 rounded-xl text-white font-medium transition-all flex items-center ${
                    isSubmitting 
                      ? 'bg-emerald-400 cursor-not-allowed' 
                      : formData.agreement
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-gray-400 cursor-not-allowed'
                  }`}
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
                    'Laporkan Penemuan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundItemForm; 