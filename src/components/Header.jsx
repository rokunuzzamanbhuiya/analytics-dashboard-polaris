import React, { useState, useEffect } from "react";
import {
  BsFillBellFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
  BsSun,
  BsMoon,
} from "react-icons/bs";
import {
  Modal,
  Box,
  Badge,
} from "@shopify/polaris";
import OrderNotifications from "./OrderNotifications";
import { 
  getNotifications, 
  markNotificationAsRead, 
  archiveNotification 
} from "../api/shopify";
import config from "../config/shopify";

function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState([]);

  // --- User State ---
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log('🔔 API Response:', response.data);
      
      // Handle new API response format: {success: true, data: array, count: number, ...}
      const data = response.data;
      const notificationsData = Array.isArray(data?.data) ? data.data : [];
      
      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData);
        console.log('🔔 Notifications fetched:', notificationsData.length);
      } else {
        console.warn('⚠️ API returned non-array data:', data);
        setNotifications([]);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Set empty array on error to prevent crashes
      setNotifications([]);
    }
  };

  // Fetch notifications on component mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Set up polling every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Count unread - with extra safety checks
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter((n) => !n.read && !n.archived).length 
    : 0;

  // Handle marking notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  // Handle archiving notification
  const handleArchive = async (id) => {
    try {
      await archiveNotification(id);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, archived: true } : n)
      );
    } catch (error) {
      console.error('❌ Error archiving notification:', error);
    }
  };

  // Handle Shopify OAuth login
  const handleShopifyLogin = () => {
    // Get the current hostname to determine the redirect URL
    const hostname = window.location.hostname;
    const redirectUri = hostname === 'localhost' 
      ? 'http://localhost:5173/auth/callback'
      : `https://${hostname}/auth/callback`;
    
    // Use configuration values
    const { storeDomain, apiKey, scopes } = config.shopify;
    
    // Validate configuration
    if (storeDomain === 'your-store.myshopify.com' || apiKey === 'your-api-key') {
      alert('Please configure your Shopify store domain and API key in the config file.');
      return;
    }
    
    // Shopify OAuth URL
    const shopifyAuthUrl = `https://${storeDomain}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect to Shopify OAuth
    window.location.href = shopifyAuthUrl;
  };

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('shopify_user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('shopify_user');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>

      <div className="header-left">
        <BsSearch className="icon" />
      </div>

      <div className="header-right">
        {/* Notification with badge */}
        <div
          className="relative icon cursor-pointer"
          onClick={() => setShowNotifications(true)}
        >
          <BsFillBellFill />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "15px",
                right: "125px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "8px 6px",
                fontSize: "10px",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* User profile or login */}
        {isAuthenticated && user ? (
          <div className="user-profile">
            <img 
              src={user.avatar_url || user.image || '/default-avatar.png'} 
              alt={user.first_name || 'User'} 
              className="user-avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Could add a user menu here
                console.log('User profile clicked');
              }}
            />
          </div>
        ) : (
          <span
            className="icon cursor-pointer"
            onClick={handleShopifyLogin}
            title="Login with Shopify"
          >
            <BsPersonCircle />
          </span>
        )}

        <span className="icon theme-toggle-icon" onClick={toggleTheme}>
          {isDarkTheme ? <BsSun /> : <BsMoon />}
        </span>
      </div>

      {/* Notifications Modal */}
      <Modal
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Order Notifications"
        large
      >
        <Box padding="400">
          <OrderNotifications
            notifications={notifications}
            setNotifications={setNotifications}
            onMarkAsRead={handleMarkAsRead}
            onArchive={handleArchive}
          />
        </Box>
      </Modal>

    </header>
  );
}

export default Header;
