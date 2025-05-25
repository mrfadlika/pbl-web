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

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [totalItems, setTotalItems] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lostandfound-be.raffifadlika.com/api/admin/dashboard"
        );
        const awaitResponses = await fetch(
          "https://lostandfound-be.raffifadlika.com/api/items"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const dataItem = await awaitResponses.json();
        setDashboardData(data.data);
        setTotalItems(data.data.total_lost_items + data.data.total_found_items);
        setItem(dataItem.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      section: "Main",
      isActive: true,
    },
    {
      id: "report-items",
      label: "Items Reported",
      icon: FileText,
      section: "Reports",
      directTo: "/admin/reports",
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

  // Dynamic stats cards based on API data
  const getStatsCards = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Total Items",
        value: totalItems?.toString() || "0",
        change: "+12.5%",
        changeType: "positive",
        icon: Package,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Found Items",
        value: dashboardData.total_found_items?.toString() || "0",
        change: "+8.2%",
        changeType: "positive",
        icon: TrendingUp,
        color: "from-emerald-500 to-emerald-600",
      },
      {
        title: "Lost Items",
        value: dashboardData.total_lost_items?.toString() || "0",
        change: "-2.4%",
        changeType: "negative",
        icon: ShoppingCart,
        color: "from-orange-500 to-orange-600",
      },
      {
        title: "Report Verified",
        value: dashboardData.verified_reports?.toString() || "0",
        change: "+4.1%",
        changeType: "positive",
        icon: Users,
        color: "from-purple-500 to-purple-600",
      },
    ];
  };

  const getRecentItems = () => {
    if (!item || !Array.isArray(item)) return [];

    return item.map((item) => {
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        location: item.location,
        category: item.category,
        date: item.date ? new Date(item.date).toLocaleDateString() : "N/A",
        type: item.type,
        status: item.status,
        image: item.image?.[0] || null,
        created_at: item.created_at,
        reports: item.reports || [],
      };
    });
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
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
                      Error loading dashboard data
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && dashboardData.recent_reports && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {getStatsCards().map((card, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {card.title}
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {card.value}
                          </p>
                          <div className="flex items-center mt-2"></div>
                        </div>
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}
                        >
                          <card.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Items Table */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Recent Items
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Judul
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deskripsi
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getRecentItems().length > 0 ? (
                              getRecentItems().map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{item.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.title}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.description || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.location || "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                        item.type
                                      )}`}
                                    >
                                      {getTypeText(item.type)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                        item.status
                                      )}`}
                                    >
                                      {item.status || "N/A"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex justify-center items-center space-x-2">
                                      {new Date(
                                        item.created_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="7"
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                >
                                  No recent items found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Stats
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Found Items Rate
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {dashboardData.total_found_items && totalItems
                              ? `${Math.round(
                                  (dashboardData.total_found_items /
                                    totalItems) *
                                    100
                                )}%`
                              : "0%"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width:
                                dashboardData.total_found_items && totalItems
                                  ? `${
                                      (dashboardData.total_found_items /
                                        totalItems) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Lost Items Rate
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {dashboardData.total_lost_items && totalItems
                              ? `${Math.round(
                                  (dashboardData.total_lost_items /
                                    totalItems) *
                                    100
                                )}%`
                              : "0%"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{
                              width:
                                dashboardData.total_lost_items && totalItems
                                  ? `${
                                      (dashboardData.total_lost_items /
                                        totalItems) *
                                      100
                                    }%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        System Info
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-900">
                              API Connected
                            </p>
                            <p className="text-xs text-gray-500">
                              Data synced successfully
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-900">
                              Database Status
                            </p>
                            <p className="text-xs text-gray-500">
                              All systems operational
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-900">
                              Last Updated
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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

export default AdminDashboard;
