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

const ReviewedAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("review-items");
  const [items, setItems] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reports, setReports] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReportId, setRejectReportId] = useState(null);

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

  const getShareUrl = (selectedItem) => {
    const baseUrl =
      selectedItem && selectedItem.type === "lost"
        ? `${window.location.origin}/lost-items`
        : `${window.location.origin}/found-items`;
    return `${baseUrl}?id=${selectedItem.id}`;
  };

  const shareToWhatsApp = (contact, item) => {
    const shareText = `${item.title} - Lihat detail item ini:\n ${getShareUrl(
      item
    )}`;
    const whatsappUrl = `https://wa.me/${contact}?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleVerify = async (reportId) => {
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) {
        throw new Error("Report not found");
      }

      // Ubah ke selectedItem.id karena kita memverifikasi item, bukan report
      const response = await fetch(
        `https://lostandfound-be.raffifadlika.com/api/items/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "verified",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify report");
      }

      // Share ke WhatsApp setelah verifikasi berhasil
      shareToWhatsApp(report.contact, selectedItem);

      // Refresh data
      await fetchReports(selectedItem.id);
    } catch (error) {
      console.error("Error verifying report:", error);
    }
  };

  const handleRejectClick = (reportId) => {
    setRejectReportId(reportId);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      const report = reports.find((r) => r.id === rejectReportId);
      if (!report) {
        throw new Error("Report not found");
      }

      const response = await fetch(
        `https://lostandfound-be.raffifadlika.com/api/items/${selectedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject report");
      }

      setShowRejectModal(false);
      setRejectReportId(null);

      await fetchReports(selectedItem.id);
    } catch (error) {
      console.error("Error rejecting report:", error);
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
      directTo: "/admin/reports",
    },
    {
      id: "review-items",
      label: "Review Items",
      icon: BarChart3,
      section: "Reports",
      isActive: true,
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
            {!loading && !error && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Table - Items List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Items List
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
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
                            Type
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
                              <div className="max-w-32 truncate">
                                {itemData.title}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="max-w-32 truncate">
                                {itemData.location || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                  itemData.type
                                )}`}
                              >
                                {getTypeText(itemData.type)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewItem(itemData)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Table - Item Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Item Details
                    </h3>
                  </div>
                  <div className="p-6">
                    {selectedItem ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </label>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              #{selectedItem.id}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(selectedItem.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Title
                            </label>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedItem.title}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </label>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedItem.description ||
                                "No description available"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image
                          </label>
                          {selectedItem.image.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={`https://lostandfound-be.raffifadlika.com${image}`}
                              alt={`Proof ${imgIndex + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                          ))}
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedItem.location || "N/A"}
                          </p>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedItem.category || "N/A"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </label>
                            <div className="mt-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                  selectedItem.type
                                )}`}
                              >
                                {getTypeText(selectedItem.type)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </label>
                            <div className="mt-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  selectedItem.status
                                )}`}
                              >
                                {selectedItem.status || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Item Selected
                        </h3>
                        <p className="text-sm text-gray-500">
                          Click the eye icon on any item to view its details
                          here.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Report Section */}
                  <div className="p-6">
                    <div className="pt-4 border-t border-gray-200" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Reports
                    </h3>
                    {selectedItem ? (
                      <div className="space-y-4">
                        {loadingReports ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          </div>
                        ) : reports.length > 0 ? (
                          reports.map((report, index) => (
                            <div
                              key={report.id || index}
                              className="border border-gray-200 rounded-lg p-4 space-y-3"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Report ID
                                  </label>
                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    #{report.id}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reporter Name
                                  </label>
                                  <p className="mt-1 text-sm text-gray-900">
                                    {report.userName}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Contact
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {report.contact}
                                </p>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Message
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {report.message}
                                </p>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Proof Description
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {report.proofDescription}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Report Type
                                  </label>
                                  <div className="mt-1">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                        report.report_type
                                      )}`}
                                    >
                                      {getTypeText(report.report_type)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin Review
                                  </label>
                                  <div className="mt-1">
                                    <span
                                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        report.admin_review
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {report.admin_review
                                        ? "Reviewed"
                                        : "Pending"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {report.proofImages &&
                                report.proofImages.length > 0 && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Proof Images
                                    </label>
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                      {report.proofImages.map(
                                        (image, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={`https://lostandfound-be.raffifadlika.com${image}`}
                                            alt={`Proof ${imgIndex + 1}`}
                                            className="w-full h-20 object-cover rounded border"
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                              <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Created At
                                </label>
                                <p className="mt-1 text-sm text-gray-900">
                                  {new Date(
                                    report.created_at
                                  ).toLocaleDateString()}{" "}
                                  {new Date(
                                    report.created_at
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="pt-4 border-t border-gray-200">
                                <div className="flex space-x-3">
                                  {selectedItem.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleVerify(report.id)}
                                        className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                      >
                                        Verify
                                      </button>
                                      <button
                                        onClick={() => handleRejectClick(report.id)}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {selectedItem.status === "verified" && (
                                    <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg text-center">
                                      Verified
                                    </div>
                                  )}
                                  {selectedItem.status === "rejected" && (
                                    <div className="w-full px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg text-center">
                                      Rejected
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No Reports Found
                            </h3>
                            <p className="text-sm text-gray-500">
                              This item doesn't have any reports yet.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Item Selected
                        </h3>
                        <p className="text-sm text-gray-500">
                          Click the eye icon on any item to view its details
                          here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 relative z-10">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Rejection
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to reject this report? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewedAdmin;
