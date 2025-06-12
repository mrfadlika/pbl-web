import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Search,
  Menu,
  X,
  UploadCloud,
} from "lucide-react";
import FooterGlobal from "../Footer";
import DetailModal from "../Modal";
import { getStorageUrl } from "../../services/api";
import { formatDate } from "../../utils/dateUtils";

const Katalog = ({
  initialActiveTab = "lost",
  pageTitle,
  pageDescription,
  lostItems = [],
  foundItems = [],
  categories = [
    "Semua Kategori",
    "Electronics",
    "Documents",
    "Accessories",
    "Stationery",
    "Clothing",
    "Others",
  ],
  showTabs = true,
  fixedTab = null,
}) => {
  const [activeTab, setActiveTab] = useState(fixedTab || initialActiveTab);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // If a fixed tab is provided, ensure the active tab is always that value
  useEffect(() => {
    if (fixedTab) {
      setActiveTab(fixedTab);
    }
  }, [fixedTab]);

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleOpenModal = (item) => {
    // Pastikan properti image selalu array
    const itemCopy = { ...item };
    if (itemCopy.image && !Array.isArray(itemCopy.image)) {
      itemCopy.image = [itemCopy.image];
    }
    setSelectedItem(itemCopy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const filteredItems = activeTab === "lost" ? lostItems : foundItems;

  // Filter based on search query and category
  const displayedItems = filteredItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua Kategori" || 
      item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
      {/* Enhanced Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md py-2"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo_wak.png"
                  alt="Lost & Found Logo"
                  className="h-20 w-auto"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </a>
            </nav>

            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-4 pb-3 border-t border-gray-200 mt-4">
              <div className="space-y-1">
                <a
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Home
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {pageTitle || (activeTab === "lost" ? "Barang Hilang" : "Barang Ditemukan")}
          </h1>
          <p className="text-gray-600 mt-2">
            {pageDescription || (activeTab === "lost"
              ? "Daftar barang yang hilang dan belum ditemukan."
              : "Daftar barang yang telah ditemukan dan menunggu pemiliknya.")}
          </p>
        </div>

        {/* Tabs - always shown but with different behavior based on fixedTab */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
          <a
            href="/lost-items"
            className={`px-6 sm:px-8 py-3 font-medium text-base sm:text-lg transition-colors whitespace-nowrap ${
              activeTab === "lost"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lost
          </a>
          <a
            href="/found-items"
            className={`px-6 sm:px-8 py-3 font-medium text-base sm:text-lg transition-colors whitespace-nowrap ${
              activeTab === "found"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Found
          </a>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={toggleCategoryDropdown}
              className="flex items-center justify-between w-full sm:w-48 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <span>{selectedCategory}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute right-0 z-10 w-full sm:w-48 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
                <ul className="py-2 text-sm text-gray-700">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-44 bg-gray-200">
                <img
                  src={Array.isArray(item.image) && item.image.length > 0 
                    ? getStorageUrl(item.image[0]) 
                    : typeof item.image === 'string' 
                      ? getStorageUrl(item.image) 
                      : '/placeholder-image.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.category}
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-1 text-blue-600 flex-shrink-0" />
                  <span>{formatDate(item.date, 'medium')}</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  {/* <button className="flex items-center text-xs text-blue-600 hover:text-blue-800">
                    <UploadCloud className="h-4 w-4 mr-1" />
                    {activeTab === "lost"
                      ? "Anda yang menemukan?"
                      : "Anda yang kehilangan?"}
                  </button> */}

                  <button 
                    onClick={() => handleOpenModal(item)} 
                    className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (shown when no items match) */}
        {displayedItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No items found
            </h3>
            <p className="text-gray-600 max-w-md">
              We couldn't find any {activeTab === "lost" ? "lost" : "found"}{" "}
              items matching your search. Try adjusting your filters or search
              term.
            </p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal isOpen={isModalOpen} onClose={handleCloseModal} item={selectedItem} />

      <FooterGlobal />
    </div>
  );
};

export default Katalog;