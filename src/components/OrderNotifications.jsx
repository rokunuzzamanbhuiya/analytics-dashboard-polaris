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

const OrderNotifications = ({ notifications, setNotifications, onMarkAsRead, onArchive }) => {
  // Mark as read - use the handler from parent
  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    } else {
      // Fallback to local state update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  // Archive - use the handler from parent
  const handleArchive = (id) => {
    if (onArchive) {
      onArchive(id);
    } else {
      // Fallback to local state update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
      );
    }
  };

  // Unread count - with extra safety checks
  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter((n) => !n.read && !n.archived).length 
    : 0;

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
        items={Array.isArray(notifications) ? notifications.filter((n) => !n.archived) : []}
        renderItem={(item) => {
          const { 
            id, 
            orderId, 
            customer, 
            read, 
            orderValue, 
            currency, 
            type, 
            priority, 
            status, 
            financialStatus,
            created_at 
          } = item;
          
          const getBadgeTone = (type) => {
            switch (type) {
              case 'high-value': return 'success';
              case 'pending-fulfillment': return 'warning';
              case 'payment-pending': return 'attention';
              case 'refunded': return 'critical';
              default: return 'info';
            }
          };

          const getPriorityColor = (priority) => {
            switch (priority) {
              case 'high': return '#d82c0d';
              case 'medium': return '#f49342';
              default: return '#6d7175';
            }
          };

          return (
            <ResourceItem id={id}>
              <Box paddingBlock="200">
                <InlineStack align="space-between" blockAlign="start">
                  <InlineStack gap="200" blockAlign="start" direction="column">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" fontWeight={read ? "regular" : "bold"}>
                        {orderId} - {customer}
                      </Text>
                      {!read && <Badge tone="attention">New</Badge>}
                      <Badge tone={getBadgeTone(type)}>
                        {type.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </InlineStack>
                    
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodySm" tone="subdued">
                        {currency} {orderValue.toFixed(2)}
                      </Text>
                      <Text as="span" variant="bodySm" tone="subdued">
                        • {financialStatus} / {status}
                      </Text>
                      <Text as="span" variant="bodySm" tone="subdued">
                        • {new Date(created_at).toLocaleString()}
                      </Text>
                    </InlineStack>
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
