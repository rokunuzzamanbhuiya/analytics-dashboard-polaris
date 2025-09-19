import React, { useCallback } from "react";
import {
  Text,
  Link,
  Thumbnail,
  Button,
  Modal,
  Box,
  IndexTable,
} from "@shopify/polaris";

// Custom hooks and components
import { useDashboardTables } from "../hooks/useDashboardData";
import { useOrderModal } from "../hooks/useOrderModal";
import DashboardTable from "./DashboardTable";

// Utils
import { formatDate } from "../utils/dashboardUtils";

const DashboardTables = ({ darkMode = false }) => {
  // Custom hooks
  const {
    bestSelling,
    worstSelling,
    pendingOrders,
    lowStock,
    loading,
    error,
    refreshData
  } = useDashboardTables();

  const { activeOrder, isOpen, openModal, closeModal } = useOrderModal();

  // Table row renderers
  const renderBestSellingRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={`${item.id}-${index}`} position={index}>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  const renderWorstSellingRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={`${item.id}-${index}`} position={index}>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  const renderPendingOrdersRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={`${item.id}-${index}`} position={index}>
      <IndexTable.Cell>
        <Link
          url={item.admin_url}
          target="_blank"
        >
          {item.order_number || item.name}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>
          {item.currency} {item.total_price}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.customer?.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button size="slim" onClick={() => openModal(item)}>
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), [openModal]);

  const renderLowStockRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={`${item.id}-${index}`} position={index}>
      <IndexTable.Cell>
        {item.image ? (
          <Thumbnail source={item.image} alt={item.name} size="small" />
        ) : (
          <div style={{ 
            width: 40, 
            height: 40, 
            backgroundColor: '#f6f6f7', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6d7175'
          }}>
            No Image
          </div>
        )}
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url}
          target="_blank"
        >
          {item.product_id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.stock}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  return (
    <div
      className="dashboard-tables"
      style={{ width: "100%", padding: "1rem" }}
    >
      {/* Error Display */}
      {error && (
        <Box padding="400">
          <Text tone="critical">
            Error loading data: {error}
          </Text>
        </Box>
      )}

      {/* Best Selling */}
      <DashboardTable
        title="Best Selling Products"
        items={bestSelling}
        columns={[{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }]}
        rowRenderer={renderBestSellingRow}
        loading={loading}
        darkMode={darkMode}
      />

      <Box paddingBlock="400" />

      {/* Worst Selling */}
      <DashboardTable
        title="Worst Selling Products"
        items={worstSelling}
        columns={[{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }]}
        rowRenderer={renderWorstSellingRow}
        loading={loading}
        darkMode={darkMode}
      />

      <Box paddingBlock="400" />

      {/* Pending Orders */}
      <DashboardTable
        title="Pending / Unfulfilled Orders"
        items={pendingOrders}
        columns={[
          { title: "Order ID" },
          { title: "Value" },
          { title: "Customer Name" },
          { title: "Actions" },
        ]}
        rowRenderer={renderPendingOrdersRow}
        loading={loading}
        darkMode={darkMode}
      />

      <Box paddingBlock="400" />

      {/* Low Stock */}
      <DashboardTable
        title="Low Stock Alerts"
        items={lowStock}
        columns={[
          { title: "Image" },
          { title: "Name" },
          { title: "Product ID" },
          { title: "Stock Qty" },
          { title: "Actions" },
        ]}
        rowRenderer={renderLowStockRow}
        loading={loading}
        darkMode={darkMode}
      />

      {/* Order Modal */}
      {isOpen && activeOrder && (
        <Modal
          open={isOpen}
          onClose={closeModal}
          title={`Order ${activeOrder.order_number || activeOrder.name} Summary`}
          primaryAction={{
            content: "Close",
            onAction: closeModal,
          }}
        >
          <Modal.Section>
            <Text variant="headingMd">
              Order Details
            </Text>
            <Box paddingBlockStart="200">
              <Text>
                <strong>Order Number:</strong> {activeOrder.order_number || activeOrder.name}
              </Text>
              <Text>
                <strong>Order ID:</strong> {activeOrder.id}
              </Text>
              <Text>
                <strong>Total Value:</strong> {activeOrder.currency} {activeOrder.total_price}
              </Text>
              <Text>
                <strong>Status:</strong> {activeOrder.fulfillment_status} / {activeOrder.financial_status}
              </Text>
              <Text>
                <strong>Created:</strong> {formatDate(activeOrder.created_at)}
              </Text>
            </Box>
            
            <Box paddingBlockStart="400">
              <Text variant="headingMd">
                Customer Information
              </Text>
              <Box paddingBlockStart="200">
                <Text>
                  <strong>Name:</strong> {activeOrder.customer?.name}
                </Text>
                {activeOrder.customer?.email && (
                  <Text>
                    <strong>Email:</strong> {activeOrder.customer.email}
                  </Text>
                )}
                {activeOrder.customer?.phone && (
                  <Text>
                    <strong>Phone:</strong> {activeOrder.customer.phone}
                  </Text>
                )}
              </Box>
            </Box>

            {activeOrder.shipping_address && (
              <Box paddingBlockStart="400">
                <Text variant="headingMd">
                  Shipping Address
                </Text>
                <Box paddingBlockStart="200">
                  <Text>
                    {activeOrder.shipping_address.name}
                  </Text>
                  <Text>
                    {activeOrder.shipping_address.address1}
                  </Text>
                  <Text>
                    {activeOrder.shipping_address.city}, {activeOrder.shipping_address.province} {activeOrder.shipping_address.zip}
                  </Text>
                  <Text>
                    {activeOrder.shipping_address.country}
                  </Text>
                </Box>
              </Box>
            )}

            <Box paddingBlockStart="400">
              <Text variant="headingMd">
                Order Items
              </Text>
              <Box paddingBlockStart="200">
                <Text>{activeOrder.summary}</Text>
              </Box>
            </Box>

            <Box paddingBlockStart="400">
              <Button
                url={activeOrder.admin_url}
                target="_blank"
              >
                View in Shopify Admin
              </Button>
            </Box>
          </Modal.Section>
        </Modal>
      )}
    </div>
  );
};

export default DashboardTables;