import { useState, useEffect } from "react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import "./App.css";
// import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
// import OrderNotifications from "./components/OrderNotifications";
// import DashboardTables from "./components/DashboardTables";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

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
    </AppProvider>
  );
}

export default App;
