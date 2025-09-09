// import React, { useState } from "react";
// import {
//   Card,
//   ResourceList,
//   ResourceItem,
//   Text,
//   Button,
//   Badge,
//   Box,
//   InlineStack,
// } from "@shopify/polaris";

// const OrderNotifications = () => {

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

//   const handleMarkAsRead = (id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   };

//   const handleArchive = (id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
//     );
//   };

//   return (
//     <Card>
//       <Box padding="400">
//         <InlineStack align="center" gap="200" blockAlign="center">
//           <Text as="h2" variant="headingMd">
//             Notifications
//           </Text>
//           {unreadCount > 0 && <Badge tone="new">{unreadCount} Unread</Badge>}
//         </InlineStack>
//       </Box>

//       <ResourceList
//         resourceName={{ singular: "notification", plural: "notifications" }}
//         items={notifications.filter((n) => !n.archived)}
//         renderItem={(item) => {
//           const { id, orderId, customer, read } = item;
//           return (
//             <ResourceItem id={id}>
//               <Box paddingBlock="200">
//                 <InlineStack align="space-between" blockAlign="center">
//                   <InlineStack gap="200" blockAlign="center">
//                     <Text as="span" fontWeight={read ? "regular" : "bold"}>
//                       {orderId} - {customer}
//                     </Text>
//                     {!read && <Badge tone="attention">New</Badge>}
//                   </InlineStack>

//                   <InlineStack gap="200">
//                     {!read && (
//                       <Button size="slim" onClick={() => handleMarkAsRead(id)}>
//                         Mark as Read
//                       </Button>
//                     )}
//                     <Button size="slim" onClick={() => handleArchive(id)}>
//                       Archive
//                     </Button>
//                   </InlineStack>
//                 </InlineStack>
//               </Box>
//             </ResourceItem>
//           );
//         }}
//       />
//     </Card>
//   );
// };

// export default OrderNotifications;

import React from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  Button,
  Badge,
  Box,
  InlineStack,
} from "@shopify/polaris";

const OrderNotifications = ({ notifications, setNotifications }) => {
  // Mark as read
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Archive
  const handleArchive = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
  };

  // Unread count
  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived
  ).length;

  return (
    <Card>
      <Box padding="400">
        <InlineStack align="center" gap="200" blockAlign="center">
          <Text as="h2" variant="headingMd">
            Notifications
          </Text>
          {unreadCount > 0 && <Badge tone="new">{unreadCount} Unread</Badge>}
        </InlineStack>
      </Box>

      <ResourceList
        resourceName={{ singular: "notification", plural: "notifications" }}
        items={notifications.filter((n) => !n.archived)}
        renderItem={(item) => {
          const { id, orderId, customer, read } = item;
          return (
            <ResourceItem id={id}>
              <Box paddingBlock="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <Text as="span" fontWeight={read ? "regular" : "bold"}>
                      {orderId} - {customer}
                    </Text>
                    {!read && <Badge tone="attention">New</Badge>}
                  </InlineStack>

                  <InlineStack gap="200">
                    {!read && (
                      <Button size="slim" onClick={() => handleMarkAsRead(id)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button size="slim" onClick={() => handleArchive(id)}>
                      Archive
                    </Button>
                  </InlineStack>
                </InlineStack>
              </Box>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
};

export default OrderNotifications;
