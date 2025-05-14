import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Share2, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegramPlane, FaCopy } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { reportsApi } from '../../services/api';

const DetailModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const navigate = useNavigate();
  const location = useLocation();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [reports, setReports] = useState(item.reports || []);
  const [selectedReport, setSelectedReport] = useState(null);

  const isInLostItems = location.pathname.includes('/lost-items');
  const isInFoundItems = location.pathname.includes('/found-items');

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.image.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.image.length) % item.image.length);
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?id=${item.id}`;
  };

  const shareToWhatsApp = () => {
    const shareText = `${item.title} - Lihat detail item ini:\n ${getShareUrl()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToTwitter = () => {
    const tweetText = `${item.title} - Lost & Found`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToTelegram = () => {
    const telegramText = `${item.title} - Lihat detail item ini: ${getShareUrl()}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(telegramText)}`;
    window.open(telegramUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareUrl())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const navigateToReportForm = () => {
    onClose();
    
    const formType = isInLostItems ? 'claim' : 'report';
    
    navigate(`/forms/${formType}?id=${item.id}&category=${item.category}&title=${encodeURIComponent(item.title)}&location=${encodeURIComponent(item.location)}&date=${encodeURIComponent(item.date)}`);
  };

  const navigateToSubmissionForm = () => {
    onClose();
    
    const formPath = isInLostItems ? '/forms-found' : '/forms-lost';
    navigate(formPath);
  };

  const handleForwardToAdmin = async (report) => {
    const confirmation = confirm(`Anda yakin ingin memilih laporan dari ${report.userName} untuk diteruskan ke Admin?`);
    if (confirmation) {
      setSelectedReport(report);
      
      try {
        // Panggil API untuk toggle status admin_review
        await reportsApi.toggleAdminReview(report.id);
        
        alert(`Laporan dari ${report.userName} telah diteruskan ke Admin untuk verifikasi lebih lanjut.`);
        onClose();
      } catch (error) {
        console.error("Error forwarding report to admin:", error);
        alert("Terjadi kesalahan saat meneruskan laporan ke admin. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative">
              <div className="relative h-72 md:h-[500px]">
                <img
                  src={item.image[currentImageIndex]}
                  alt={item.title}
                  className="h-full w-full rounded-t-2xl object-cover md:rounded-l-2xl md:rounded-tr-none"
                />
                
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
                    {item.category}
                  </span>
                </div>

                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={prevImage}
                    className="ml-2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={nextImage}
                    className="mr-2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {item.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[500px]">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h2>
                <p className="text-gray-600 mb-6">{item.description}</p>

                <div className="space-y-5 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Lokasi</p>
                      <p className="text-gray-800 font-medium">{item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Tanggal</p>
                      <p className="text-gray-800 font-medium">{item.date}</p>
                    </div>
                  </div>
                </div>

                {reports.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-start mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex-shrink-0 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-blue-700 font-medium">Petunjuk penggunaan:</h4>
                        <p className="text-sm text-blue-600">
                          Periksa laporan-laporan di bawah ini dan pilih salah satu dengan menekan tombol "Lempar ke Admin" jika Anda yakin laporan tersebut valid. Laporan yang dipilih akan diteruskan ke Admin untuk verifikasi lebih lanjut.
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Laporan Terkait</h3>
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div key={report.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-gray-900">{report.userName}</p>
                            <p className="text-sm text-gray-500">{report.date}</p>
                          </div>
                          <p className="text-gray-700 mb-2">{report.message}</p>
                          {report.proofDescription && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-sm text-gray-500">
                                {item.category === 'Hilang' ? 'Bukti Kepemilikan:' : 'Ciri-ciri Pemilik:'}
                              </p>
                              <p className="text-gray-700">{report.proofDescription}</p>
                            </div>
                          )}
                          {report.proofImages && report.proofImages.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-500 mb-2">Foto Bukti:</p>
                              <div className="grid grid-cols-3 gap-2">
                                {report.proofImages.map((img, idx) => (
                                  <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Bukti ${idx + 1}`} 
                                    className="h-20 w-full object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                            <p className="text-sm text-gray-500">Kontak: {report.contact}</p>
                            <button 
                              onClick={() => handleForwardToAdmin(report)}
                              className="flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg py-1.5 px-3 text-indigo-700 text-sm font-medium transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polygon points="10 8 16 12 10 16 10 8"/>
                              </svg>
                              <span>Lempar ke Admin</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {reports.length === 0 && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                    <p className="text-gray-700 mb-3">Belum ada laporan untuk item ini</p>
                    <button 
                      onClick={navigateToSubmissionForm}
                      className="inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg text-amber-600 transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {isInLostItems ? 'Isi Formulir Barang Ditemukan' : 'Isi Formulir Barang Hilang'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 flex gap-3">
                <button 
                  onClick={toggleShareOptions}
                  className="relative flex-1 flex items-center justify-center rounded-xl bg-blue-50 px-6 py-3 text-blue-600 font-medium transition-all hover:bg-blue-100"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  <span>Bagikan</span>
                  
                  {showShareOptions && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-white shadow-lg border border-gray-200 p-3 z-10">
                      <h4 className="text-sm font-semibold mb-2 text-gray-700">Bagikan via</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={shareToWhatsApp} 
                          className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 hover:bg-green-50 transition-colors"
                        >
                          <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaWhatsapp className="text-green-600 text-xl" />
                          </div>
                          <span className="text-xs font-medium">WhatsApp</span>
                        </button>
                        <button 
                          onClick={shareToFacebook} 
                          className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                        >
                          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaFacebook className="text-blue-600 text-xl" />
                          </div>
                          <span className="text-xs font-medium">Facebook</span>
                        </button>
                        <button 
                          onClick={shareToTwitter} 
                          className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 hover:bg-sky-50 transition-colors"
                        >
                          <div className="bg-sky-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaTwitter className="text-sky-500 text-xl" />
                          </div>
                          <span className="text-xs font-medium">Twitter</span>
                        </button>
                        <button 
                          onClick={shareToTelegram} 
                          className="flex flex-col items-center justify-center space-y-1 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                        >
                          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaTelegramPlane className="text-blue-500 text-xl" />
                          </div>
                          <span className="text-xs font-medium">Telegram</span>
                        </button>
                        <button 
                          onClick={copyToClipboard} 
                          className="flex items-center justify-center space-x-2 rounded-lg p-2 hover:bg-gray-50 transition-colors col-span-2 mt-1 border border-gray-200"
                        >
                          <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                            <FaCopy className="text-gray-600 text-sm" />
                          </div>
                          <span className="text-sm font-medium">{copied ? "Tersalin!" : "Salin Link"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </button>
                <button 
                  onClick={navigateToReportForm}
                  className="flex-1 flex items-center justify-center rounded-xl bg-amber-100 px-6 py-3 text-amber-600 font-medium transition-all hover:bg-amber-200"
                >
                  <Send className="h-5 w-5 mr-2" />
                  <span>{isInLostItems ? 'Laporan Penemuan' : 'Laporan Pemilik'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal; 