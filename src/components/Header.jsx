// import React from "react";
// import {
//   BsFillBellFill,
//   BsPersonCircle,
//   BsSearch,
//   BsJustify,
//   BsSun,
//   BsMoon,
// } from "react-icons/bs";

// function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
//   return (
//     <header className="header">
//       <div className="menu-icon">
//         <BsJustify className="icon" onClick={OpenSidebar} />
//       </div>
//       <div className="header-left">
//         <BsSearch className="icon" />
//       </div>
//       <div className="header-right">
//         <BsFillBellFill className="icon" />
//         <BsPersonCircle className="icon" />
//         <span className="icon theme-toggle-icon" onClick={toggleTheme}>
//           {isDarkTheme ? <BsSun /> : <BsMoon />}
//         </span>
//       </div>
//     </header>
//   );
// }

// export default Header;

// ========================================

// import React, { useState } from "react";
// import {
//   BsFillBellFill,
//   BsPersonCircle,
//   BsSearch,
//   BsJustify,
//   BsSun,
//   BsMoon,
// } from "react-icons/bs";
// import { Modal, Box, Badge } from "@shopify/polaris";
// import OrderNotifications from "./OrderNotifications";

// function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
//   const [showNotifications, setShowNotifications] = useState(false);

//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       orderId: "#1001",
//       customer: "John Doe",
//       read: false,
//       archived: false,
//     },
//     {
//       id: 2,
//       orderId: "#1002",
//       customer: "Jane Smith",
//       read: false,
//       archived: false,
//     },
//     {
//       id: 3,
//       orderId: "#1003",
//       customer: "Ali Khan",
//       read: true,
//       archived: false,
//     },
//   ]);

//   const unreadCount = notifications.filter(
//     (n) => !n.read && !n.archived
//   ).length;

//   return (
//     <header className="header">
//       <div className="menu-icon">
//         <BsJustify className="icon" onClick={OpenSidebar} />
//       </div>

//       <div className="header-left">
//         <BsSearch className="icon" />
//       </div>

//       <div className="header-right">
//         <div
//           className="relative icon cursor-pointer"
//           onClick={() => setShowNotifications(true)}
//         >
//           <BsFillBellFill />
//           {unreadCount > 0 && (
//             <span
//               style={{
//                 position: "absolute",
//                 top: "15px",
//                 right: "125px",
//                 background: "red",
//                 color: "white",
//                 borderRadius: "50%",
//                 padding: "8px 6px",
//                 fontSize: "10px",
//               }}
//             >
//               {unreadCount}
//             </span>
//           )}
//         </div>

//         <BsPersonCircle className="icon" />

//         <span className="icon theme-toggle-icon" onClick={toggleTheme}>
//           {isDarkTheme ? <BsSun /> : <BsMoon />}
//         </span>
//       </div>

//       <Modal
//         open={showNotifications}
//         onClose={() => setShowNotifications(false)}
//         title="Order Notifications"
//         large
//       >
//         <Box padding="400">
//           <OrderNotifications
//             notifications={notifications}
//             setNotifications={setNotifications}
//           />
//         </Box>
//       </Modal>
//     </header>
//   );
// }

// export default Header;

// ========================================


import React, { useState } from "react";
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

function Header({ OpenSidebar, toggleTheme, isDarkTheme }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      orderId: "#1001",
      customer: "John Doe",
      read: false,
      archived: false,
    },
    {
      id: 2,
      orderId: "#1002",
      customer: "Jane Smith",
      read: false,
      archived: false,
    },
    {
      id: 3,
      orderId: "#1003",
      customer: "Ali Khan",
      read: true,
      archived: false,
    },
  ]);

  // --- Login State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Count unread
  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

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
