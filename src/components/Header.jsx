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
  TextField,
  Button,
  Form,
  FormLayout,
} from "@shopify/polaris";
import OrderNotifications from "./OrderNotifications";
import { 
  getNotifications, 
  markNotificationAsRead, 
  archiveNotification 
} from "../api/shopify";

function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState([]);

  // --- Login State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      console.log('🔔 API Response:', response.data);
      
      // Ensure we always set an array
      const data = response.data;
      if (Array.isArray(data)) {
        setNotifications(data);
        console.log('🔔 Notifications fetched:', data.length);
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
    
    // Set up polling every 45 seconds
    const interval = setInterval(fetchNotifications, 45000);
    
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

  // Handle login (demo)
  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
    setShowLogin(false);
  };

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

        {/* Login icon */}
        <span
          className="icon cursor-pointer"
          onClick={() => setShowLogin(true)}
        >
          <BsPersonCircle />
        </span>

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

      {/* Login Modal */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)} title="Login">
        <Box padding="400">
          <Form onSubmit={handleLogin}>
            <FormLayout>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                requiredIndicator
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                requiredIndicator
              />
              <Button submit primary>
                Login
              </Button>
            </FormLayout>
          </Form>
        </Box>
      </Modal>
    </header>
  );
}

export default Header;
