import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Bell,
  User,
  ArrowRight,
} from "lucide-react";
import FooterGlobal from "../Footer";
import { itemsApi, reportsApi, getStorageUrl } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ambil data barang hilang terbaru
        const lostResponse = await itemsApi.getAll({ 
          type: 'lost',
          limit: 4, 
          sort: 'created_at',
          order: 'desc'
        });
        
        // Ambil data barang ditemukan terbaru
        const foundResponse = await itemsApi.getAll({ 
          type: 'found',
          limit: 4, 
          sort: 'created_at',
          order: 'desc'
        });
        
        // Ambil data successful matches terbaru (opsional, jika ada endpoint khusus)
        const matchedResponse = await fetch('/api/dummy-successes.json')
          .then(res => res.json())
          .catch(() => []);
        
        // Update state dengan data dari API
        setLostItems(lostResponse.data?.data || []);
        setFoundItems(foundResponse.data?.data || []);
        setMatchedItems(matchedResponse || []);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const categories = [
    { id: "all", name: "All" },
    { id: "wallet", name: "Wallet" },
    { id: "bag", name: "Bag" },
    { id: "phone", name: "Phone" },
    { id: "watch", name: "Watch" },
    { id: "keys", name: "Keys" },
    { id: "laptop", name: "Laptop" },
    { id: "id", name: "ID Card" },
  ];

  // Fallback data jika API belum tersedia
  const fallbackMatchedItems = [
    {
      id: 9,
      lost: {
        title: "AirPods Pro",
        user: "Sarah L.",
        date: "May 7, 2025",
      },
      found: {
        title: "AirPods Pro in White Case",
        user: "Mike T.",
        date: "May 8, 2025",
      },
      image: "https://placehold.co/400x300/ffffff/333333?text=AirPods",
    },
  ];

  // Filter item berdasarkan kategori yang dipilih
  const filteredFoundItems = activeTab === "all" 
    ? foundItems 
    : foundItems.filter(item => item.category?.toLowerCase() === activeTab);
  
  const filteredLostItems = activeTab === "all"
    ? lostItems
    : lostItems.filter(item => item.category?.toLowerCase() === activeTab);

  // Jika tidak ada data matched dari API, gunakan data fallback
  const displayedMatchedItems = matchedItems.length > 0 ? matchedItems : fallbackMatchedItems;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-6 md:px-12 lg:px-12">
        <div className="container">
          {/* Navigation Bar */}
          <div className="flex justify-between items-center mb-10 mx-auto">
            <div className="flex items-center">
              <div className="text-2xl font-bold tracking-tighter">
                <img
                  src="/logo_wak.png"
                  alt="Lost & Found Logo"
                  className="h-18 w-auto"
                />
              </div>
            </div>
            <nav className="flex gap-6 items-center">
              <a
                href="/lost-items"
                className="hover:text-indigo-200 transition font-medium"
              >
                List
              </a>
              <a
                href="#"
                className="hover:text-indigo-200 transition font-medium"
              >
                Minfess
              </a>
            </nav>
          </div>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            {/* Left Text Column */}
            <div className="md:w-1/2">
              <h1 className="text-6xl md:text-7xl font-bold mb-3 leading-tight uppercase">
                Lost it? Found it?
                <br />
                We got you
              </h1>
              <p className="text-indigo-100 mb-6 text-lg">
                Kami hadir untuk memudahkan proses pelaporan dan pencarian
                barang hilang. Cukup unggah informasi, dan biarkan komunitas
                membantu menemukan atau mengembalikannya ke tempat semestinya.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mt-8">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full py-4 px-6 rounded-full shadow-lg border-0 focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full transition">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Right Image Column - Only visible on desktop */}
            <div className="hidden md:block relative">
              <img
                src="/banyak-orang.svg"
                alt="People collaborating"
                className="w-full h-auto max-w-none md:scale-125 lg:scale-100 transform origin-right object-right-bottom"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="container mx-auto px-4 mt-24 md:mt-5 mb-12">
        <div className="relative">
          <div className="flex justify-center">
            <div className="flex overflow-x-auto scrollbar-hide py-2 gap-2 px-2 max-w-full">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-5 py-2.5 whitespace-nowrap rounded-full transition flex-shrink-0 ${
                    activeTab === category.id
                      ? "bg-indigo-600 text-white font-medium shadow-md"
                      : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                  }`}
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Found Items */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recently Found Items
          </h2>
          <a
            href="/found-items"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredFoundItems.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Belum ada barang ditemukan dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoundItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={Array.isArray(item.image) && item.image.length > 0 
                      ? getStorageUrl(item.image[0]) 
                      : typeof item.image === 'string' 
                        ? getStorageUrl(item.image) 
                        : '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-1.5 text-sm">
                    <MapPin size={16} className="mr-1.5 text-indigo-600" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1.5 text-indigo-600" />
                    <span>{formatDate(item.date, 'medium')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lost Items */}
      <section className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recently Lost Items
          </h2>
          <a
            href="/lost-items"
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredLostItems.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Belum ada barang hilang dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLostItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={Array.isArray(item.image) && item.image.length > 0 
                      ? getStorageUrl(item.image[0]) 
                      : typeof item.image === 'string' 
                        ? getStorageUrl(item.image) 
                        : '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-1.5 text-sm">
                    <MapPin size={16} className="mr-1.5 text-red-500" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1.5 text-red-500" />
                    <span>{formatDate(item.date, 'medium')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Success Stories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These items were successfully returned to their owners thanks to our
            community members.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {displayedMatchedItems.map((match) => (
            <div
              key={match.id}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-md"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3">
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                      src={typeof match.image === 'string' ? getStorageUrl(match.image) : '/placeholder-image.jpg'}
                      alt={match.lost.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
                      Mission Complete!
                    </span>
                    <Bell className="ml-2 text-yellow-500" size={18} />
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <p className="font-medium text-gray-800">
                      Lost by {match.lost.user} on {formatDate(match.lost.date, 'medium')}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {match.lost.title}
                    </h3>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="font-medium text-gray-800">
                      Found by {match.found.user} on {formatDate(match.found.date, 'medium')}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {match.found.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === 1 ? "bg-indigo-600" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      <FooterGlobal />
    </div>
  );
}
