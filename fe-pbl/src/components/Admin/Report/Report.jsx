import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Bell,
  Search,
  Settings,
  Menu,
  X,
  Home,
  Package,
  FileText,
  PieChart,
  MessageSquare,
  Calendar,
  User,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  MapPin,
  Clock,
  Tag,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStorageUrl } from "../../../services/api";

const AdminReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("report-items");
  const [activeItemTab, setActiveItemTab] = useState("lost");
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lostandfound-be.raffifadlika.com/api/items"
        );
        const data = await response.json();
        const itemWithoutReports = data.data.filter(
          (item) => !item.reports || item.reports.length === 0
        );
        const lost = itemWithoutReports.filter((item) => item.type === "lost");
        const found = itemWithoutReports.filter(
          (item) => item.type === "found"
        );
        setLostItems(lost);
        setFoundItems(found);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
    setReportData(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      section: "Main",
      directTo: "/admin",
    },
    {
      id: "report-items",
      label: "Items Reported",
      icon: FileText,
      section: "Reports",
      isActive: true,
    },
    {
      id: "review-items",
      label: "Review Items",
      icon: BarChart3,
      section: "Reports",
      directTo: "/admin/review",
    },
    {
      id: "register",
      label: "Register",
      icon: Users,
      section: "Management",
      directTo: "/admin/register",
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "found":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewItem = async (itemData) => {
    setLoadingModal(true);
    setSelectedItem(itemData);
    setShowViewModal(true);

    // Simulasi loading untuk fetch data detail
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Set report data dengan format yang sesuai
    setReportData({
      ...itemData,
      reportedBy: itemData.reportedBy || "Unknown User",
      contactInfo: itemData.contact || "No contact info",
      additionalNotes: itemData.additionalNotes || "No additional notes",
    });

    setLoadingModal(false);
  };

  const handleDeleteItem = (itemData) => {
    // Mock SweetAlert2 functionality
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${itemData.title}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      if (itemData.type === "lost") {
        setLostItems((prev) => prev.filter((item) => item.id !== itemData.id));
      } else {
        setFoundItems((prev) => prev.filter((item) => item.id !== itemData.id));
      }

      // Mock success notification
      alert("Item deleted successfully!");
    }
  };

  const filterItems = (items) => {
    if (!searchTerm) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderSidebarSection = (sectionName, items) => (
    <div key={sectionName} className="mb-8">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 mb-3">
        {sectionName}
      </h3>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            if (item.directTo) {
              navigate(item.directTo);
            }
          }}
          className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === item.id
              ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.label}
        </button>
      ))}
    </div>
  );

  const renderTable = (items, title) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        {items.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((itemData, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{itemData.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="max-w-32 truncate font-medium">
                      {itemData.title}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="max-w-32 truncate">
                      {itemData.location || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="max-w-24 truncate">
                      {itemData.category || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {new Date(itemData.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        itemData.status
                      )}`}
                    >
                      {itemData.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewItem(itemData)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(itemData)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Items Found
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm
                ? `No items match your search "${searchTerm}"`
                : `No ${activeItemTab} items without reports found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const ViewModal = () => {
    if (!showViewModal || !selectedItem) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Item Details
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
            {loadingModal ? (
              // Loading State
              <div className="p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mb-6 w-1/2"></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-16 bg-gray-300 rounded"></div>
                  <div className="h-16 bg-gray-300 rounded"></div>
                  <div className="h-16 bg-gray-300 rounded"></div>
                  <div className="h-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            ) : (
              // Main Content
              <div className="p-6">
                {/* Image Section */}
                <div className="mb-6">
                  <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                    {selectedItem.image && selectedItem.image[0] ? (
                      <img
                        src={getStorageUrl(selectedItem.image[0])}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gray-400 rounded-xl flex items-center justify-center">
                          <Package className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-medium">
                          No Image Available
                        </p>
                        <p className="text-xs text-gray-400">
                          Image not provided
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedItem.title}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedItem.status
                      )}`}
                    >
                      {selectedItem.status || "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {selectedItem.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Item ID: {selectedItem.id}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Location */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Location
                    </span>
                    <div className="flex items-center gap-3 text-gray-900 font-medium">
                      <MapPin size={18} className="text-gray-400" />
                      {selectedItem.location}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Category
                    </span>
                    <div className="flex items-center gap-3 text-blue-600 font-medium">
                      <Tag size={18} className="text-gray-400" />
                      {selectedItem.category}
                    </div>
                  </div>

                  {/* Date Reported */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Date Reported
                    </span>
                    <div className="flex items-center gap-3 text-gray-900 font-medium">
                      <Calendar size={18} className="text-gray-400" />
                      {new Date(selectedItem.date).toLocaleDateString("id-ID")}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Type
                    </span>
                    <div className="flex items-center gap-3 text-gray-900 font-medium">
                      <User size={18} className="text-gray-400" />
                      {selectedItem.type === "lost"
                        ? "Lost Item"
                        : "Found Item"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                    Description
                  </span>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                {reportData && (
                  <>
                    <div className="mb-6">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Contact Information
                      </span>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 font-medium">
                          {reportData.contactInfo}
                        </p>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {reportData.additionalNotes &&
                      reportData.additionalNotes !== "No additional notes" && (
                        <div className="mb-6">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                            Additional Notes
                          </span>
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                            <p className="text-blue-800 text-sm">
                              {reportData.additionalNotes}
                            </p>
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const currentItems =
    activeItemTab === "lost" ? filterItems(lostItems) : filterItems(foundItems);
  const allLostItems = filterItems(lostItems);
  const allFoundItems = filterItems(foundItems);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-32 px-12 border-b border-gray-200">
          <img src="/logo_wak.png" alt="" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="mt-8">
          {Object.entries(groupedItems).map(([section, items]) =>
            renderSidebarSection(section, items)
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Items Reported
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading report data
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && (
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search items by title, location, category, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                      <button
                        onClick={() => setActiveItemTab("lost")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeItemTab === "lost"
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4" />
                          <span>Lost Items</span>
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {allLostItems.length}
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveItemTab("found")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeItemTab === "found"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Found Items</span>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {allFoundItems.length}
                          </span>
                        </div>
                      </button>
                    </nav>
                  </div>

                  {/* Table Content */}
                  <div className="p-6">
                    {renderTable(
                      currentItems,
                      activeItemTab === "lost" ? "Lost Items" : "Found Items"
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Modal */}
      <ViewModal />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminReport;
