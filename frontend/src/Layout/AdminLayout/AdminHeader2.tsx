import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUser } from "react-icons/fa";
import logoImage from "../../../Public/banner/MindfulHaven_logo.png";
import {
  logout,
  markAllAdminNotificationsAsRead,
  fetchAdminNotifications,
} from "../../Redux/Store/Slices/adminSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";

function AdminHeader2() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const {
    admin,
    token,
    adminNotifications,
    hasFetchedAdminNotifications,
    notificationsRead,
  } = useSelector((state: RootState) => state.admin);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const toggleNotifications = () => setIsNotificationOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/admin_login");
  };

  const handleMarkAllAsRead = () => {
      dispatch(markAllAdminNotificationsAsRead());
  };

  useEffect(() => {
    if (!hasFetchedAdminNotifications) {
      dispatch(fetchAdminNotifications());
    }
  }, [dispatch, hasFetchedAdminNotifications]);

  return (
    <header className="bg-headercolor shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-2 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img src={logoImage} alt="MindfulHaven Logo" className="h-12 w-auto md:h-20" />
          <div className="text-lg md:text-2xl font-bold text-btncolor whitespace-nowrap">
            MindfulHaven
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications Bell */}
          <div className="relative">
            <button onClick={toggleNotifications} className="text-btncolor relative">
              <FaBell className="text-2xl" />
              {adminNotifications?.pendingIssuesCount > 0 ||
              adminNotifications?.pendingTherapistVerification?.length > 0 ? (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {adminNotifications.pendingIssuesCount +
                    adminNotifications.pendingTherapistVerification.length}
                </span>
              ) : null}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
                <div className="px-4 py-2 border-b flex justify-between items-center">
                  <span className="font-medium text-gray-800">Notifications</span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="px-4 py-2 text-gray-800">
                  {adminNotifications?.pendingIssuesCount > 0 && (
                    <div className="mb-2">
                      You have {adminNotifications.pendingIssuesCount} issues to resolve.
                    </div>
                  )}
                  {adminNotifications?.pendingTherapistVerification?.length > 0 && (
                    <div>
                      {adminNotifications.pendingTherapistVerification.length} therapist(s) need
                      verification.
                    </div>
                  )}
                  {adminNotifications?.pendingIssuesCount === 0 &&
                    adminNotifications?.pendingTherapistVerification?.length === 0 && (
                      <div>No pending notifications.</div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Dropdown */}
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
              <FaUser className="h-6 w-6 text-btncolor" />
              {token && admin && (
                <span className="ml-2 text-gray-700 font-semibold">{admin.name || "Admin"}</span>
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader2;
