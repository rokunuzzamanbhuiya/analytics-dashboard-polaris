import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "./App.css";
// import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import AuthCallback from "./components/AuthCallback";
// import OrderNotifications from "./components/OrderNotifications";
// import DashboardTables from "./components/DashboardTables";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get('login');
    const user = urlParams.get('user');
    const error = urlParams.get('error');

    if (login === 'success' && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('shopify_user', JSON.stringify(userData));
        
        // Show success message
        alert(`Login successful! Welcome ${userData.first_name} ${userData.last_name}! You have access to the dashboard.`);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Reload to update the header
        window.location.reload();
      } catch (error) {
        console.error('Error parsing user data:', error);
        alert('Login failed: Invalid user data');
      }
    } else if (error) {
      alert(`Login failed: ${decodeURIComponent(error)}`);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  useEffect(() => {
    // Apply theme to body
    if (isDarkTheme) {
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  }, [isDarkTheme]);

  return (
    <AppProvider i18n={{}}>
      <Router>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/*" element={
            <div className="grid-container">
              <Header
                OpenSidebar={OpenSidebar}
                toggleTheme={toggleTheme}
                isDarkTheme={isDarkTheme}
              />
              <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
              />
              <Home />
              {/* <Dashboard /> */}
              {/* <OrderNotifications /> */}
              {/* <DashboardTables /> */}
            </div>
          } />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
