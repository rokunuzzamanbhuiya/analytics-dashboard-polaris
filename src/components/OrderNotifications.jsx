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

const OrderNotifications = ({
  notifications = [], // ✅ Default empty array
  setNotifications,
  onMarkAsRead,
  onArchive,
}) => {
  // ✅ Ensure we always have an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    } else if (setNotifications) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const handleArchive = (id) => {
    if (onArchive) {
      onArchive(id);
    } else if (setNotifications) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, archived: true } : n))
      );
    }
  };

  // ✅ Filter safely
  const visibleNotifications = safeNotifications.filter((n) => !n.archived);
  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  const getBadgeTone = (type) => {
    switch (type) {
      case "high-value":
        return "success";
      case "pending-fulfillment":
        return "warning";
      case "payment-pending":
        return "attention";
      case "refunded":
        return "critical";
      default:
        return "info";
    }
  };

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

      {visibleNotifications.length > 0 ? (
        <ResourceList
          resourceName={{ singular: "notification", plural: "notifications" }}
          items={visibleNotifications}
          renderItem={(item) => {
            const {
              id,
              orderId,
              customer,
              read,
              orderValue,
              currency,
              type,
              status,
              financialStatus,
              created_at,
            } = item;

            return (
              <ResourceItem id={id}>
                <Box paddingBlock="200">
                  <InlineStack align="space-between" blockAlign="start">
                    <InlineStack
                      gap="200"
                      blockAlign="start"
                      direction="column"
                    >
                      <InlineStack gap="200" blockAlign="center">
                        <Text as="span" fontWeight={read ? "regular" : "bold"}>
                          {orderId || "N/A"} - {customer || "Unknown"}
                        </Text>
                        {!read && <Badge tone="attention">New</Badge>}
                        {type && (
                          <Badge tone={getBadgeTone(type)}>
                            {type.replace("-", " ").toUpperCase()}
                          </Badge>
                        )}
                      </InlineStack>

                      <InlineStack gap="200" blockAlign="center">
                        {orderValue && currency && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            {currency} {Number(orderValue).toFixed(2)}
                          </Text>
                        )}
                        {financialStatus && status && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            • {financialStatus} / {status}
                          </Text>
                        )}
                        {created_at && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            • {new Date(created_at).toLocaleString()}
                          </Text>
                        )}
                      </InlineStack>
                    </InlineStack>

                    <InlineStack gap="200">
                      {!read && (
                        <Button
                          size="slim"
                          onClick={() => handleMarkAsRead(id)}
                        >
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
      ) : (
        <Box padding="400" textAlign="center">
          <Text as="p" tone="subdued">
            No notifications available.
          </Text>
        </Box>
      )}
    </Card>
  );
};

export default OrderNotifications;
