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
  Popover,
  ActionList,
  Button,
  Text,
} from "@shopify/polaris";
import OrderNotifications from "./OrderNotifications";
import LoginForm from "./LoginForm";
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
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

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

  // Handle login button click
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLoginForm(false);
    console.log('User logged in:', userData);
    
    // Show success message
    alert(`Login successful! Welcome ${userData.first_name} ${userData.last_name}! You have access to the dashboard.`);
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
          
          // Check if user has access
          if (parsedUser.hasAccess === false) {
            console.warn('User does not have access to this dashboard');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('shopify_user');
        }
      }
    };

    checkAuth();
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('shopify_user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
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
          style={{ position: 'relative' }}
        >
          <BsFillBellFill />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "10px",
                minWidth: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1"
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <span className="icon theme-toggle-icon" onClick={toggleTheme}>
          {isDarkTheme ? <BsSun /> : <BsMoon />}
        </span>

        {/* User profile or login */}
        {isAuthenticated && user ? (
          <Popover
            active={userMenuOpen}
            activator={
              <div 
                className="user-profile" 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => setUserMenuOpen(true)}
              >
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: user.hasAccess ? '#00a047' : '#d72c0d' }}>
                    {user.first_name} {user.last_name}
                  </div>
                </div>
                <div
                  className="user-avatar"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: user.hasAccess ? '2px solid #00a047' : '2px solid #d72c0d',
                    backgroundColor: user.hasAccess ? '#00a047' : '#d72c0d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  title={`${user.first_name} ${user.last_name} - ${user.hasAccess ? 'Has Access' : 'No Access'}`}
                >
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
              </div>
            }
            onClose={() => setUserMenuOpen(false)}
            preferredAlignment="right"
          >
            <Popover.Pane>
              <Box padding="400">
                <div style={{ marginBottom: '16px' }}>
                  <Text variant="headingMd" as="h3">
                    {user.first_name} {user.last_name}
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    {user.email}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text variant="bodySm" color={user.hasAccess ? 'success' : 'critical'}>
                      {user.hasAccess ? '✓ Access Granted' : '✗ Access Denied'}
                    </Text>
                  </div>
                </div>
                <ActionList
                  items={[
                    {
                      content: 'Logout',
                      icon: 'logout',
                      onAction: () => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }
                    }
                  ]}
                />
              </Box>
            </Popover.Pane>
          </Popover>
        ) : (
          <Popover
            active={userMenuOpen}
            activator={
              <span
                className="icon cursor-pointer"
                onClick={() => setUserMenuOpen(true)}
                title="Login with Shopify"
              >
                <BsPersonCircle />
              </span>
            }
            onClose={() => setUserMenuOpen(false)}
            preferredAlignment="right"
          >
            <Popover.Pane>
              <Box padding="400">
                <div style={{ marginBottom: '16px' }}>
                  <Text variant="headingMd" as="h3">
                    Welcome to Shopify Analytics
                  </Text>
                  <Text variant="bodyMd" color="subdued">
                    Sign in to access your dashboard
                  </Text>
                </div>
                <ActionList
                  items={[
                    {
                      content: 'Login',
                      icon: 'login',
                      onAction: () => {
                        setUserMenuOpen(false);
                        handleLoginClick();
                      }
                    }
                  ]}
                />
              </Box>
            </Popover.Pane>
          </Popover>
        )}
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

      {/* Login Form Modal */}
      <LoginForm
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onLogin={handleLoginSuccess}
      />
    </header>
  );
}

export default Header;
