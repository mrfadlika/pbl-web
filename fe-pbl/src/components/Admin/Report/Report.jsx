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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportsAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("report-items");
  const [items, setItems] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reports, setReports] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lostandfound-be.raffifadlika.com/api/items"
        );
        const data = await response.json();

        const reviewedItems = data.data.filter(
          (item) =>
            item.reports &&
            item.reports.some((report) => report.admin_review === true)
        );

        setItems(reviewedItems);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchReports = async (itemId) => {
    try {
      setLoadingReports(true);
      const response = await fetch(
        `https://lostandfound-be.raffifadlika.com/api/items/${itemId}`
      );
      const data = await response.json();
      setReports(data.data.reports || []);
    } catch (err) {
      setReports([]);
    } finally {
      setLoadingReports(false);
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

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "found":
        return "bg-emerald-100 text-emerald-800";
      case "lost":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeText = (type) => {
    switch (type?.toLowerCase()) {
      case "found":
        return "Found";
      case "lost":
        return "Lost";
      default:
        return "N/A";
    }
  };

  const handleViewItem = (itemData) => {
    setSelectedItem(itemData);
    fetchReports(itemData.id);
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

  const groupedItems = sidebarItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

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
            <X className="w-6 h- text-gray-400" />
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
              <h1 className="text-2xl font-bold text-gray-900">Review Items</h1>
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
                      Error loading review data
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
          </div>
        </main>
      </div>

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

export default ReportsAdmin;
