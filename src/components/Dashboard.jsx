import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  IndexTable,
  Text,
  Link,
  Thumbnail,
  Button,
  Modal,
  Box,
  Icon,
  Page,
} from "@shopify/polaris";
import {
  ProductIcon,
  OrderIcon,
  CashDollarIcon,
  PersonIcon,
} from "@shopify/polaris-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Custom hooks and components
import { useDashboardData, useDashboardTables } from "../hooks/useDashboardData";
import { useOrderModal } from "../hooks/useOrderModal";
import DashboardHeader from "./DashboardHeader";
import DashboardTable from "./DashboardTable";
import MetricCard from "./MetricCard";

// Utils
import {
  filterOrdersByDateRange,
  calculateTotalRevenue,
  generateChartData,
  formatCurrency,
} from "../utils/dashboardUtils";

const Dashboard = () => {
  // State
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState("7d");

  // Custom hooks
  const {
    orders,
    products,
    customers,
    loading: coreLoading,
    lastUpdated: coreLastUpdated,
    error: coreError,
    refreshData: refreshCoreData
  } = useDashboardData();

  const {
    bestSelling,
    worstSelling,
    pendingOrders,
    lowStock,
    loading: tablesLoading,
    lastUpdated: tablesLastUpdated,
    error: tablesError,
    refreshData: refreshTablesData
  } = useDashboardTables();

  const { activeOrder, isOpen, openModal, closeModal } = useOrderModal();

  // Computed values
  const filteredOrders = useMemo(() => 
    filterOrdersByDateRange(orders, dateRange), 
    [orders, dateRange]
  );

  const totalRevenue = useMemo(() => 
    calculateTotalRevenue(filteredOrders), 
    [filteredOrders]
  );

  const chartData = useMemo(() => 
    generateChartData(filteredOrders, 10), 
    [filteredOrders]
  );

  const loading = coreLoading || tablesLoading;
  const lastUpdated = new Date(Math.max(coreLastUpdated, tablesLastUpdated));

  // Event handlers
  const handleDateRangeChange = useCallback((value) => {
    setDateRange(value);
  }, []);

  const handleRefresh = useCallback(() => {
    refreshCoreData();
    refreshTablesData();
  }, [refreshCoreData, refreshTablesData]);

  const handleToggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Table row renderers
  const renderBestSellingRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  const renderWorstSellingRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  const renderPendingOrdersRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell>
        <Link
          url={`https://admin.shopify.com/orders/${item.id}`}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.value}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.customer}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button size="slim" onClick={() => openModal(item)}>
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), [openModal]);

  const renderLowStockRow = useCallback((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell>
        <Thumbnail source={item.image} alt={item.name} size="small" />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Link
          url={item.admin_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
        >
          {item.id}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text>{item.stock}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button
          url={item.public_url || `https://admin.shopify.com/products/${item.id}`}
          target="_blank"
          size="slim"
        >
          View
        </Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ), []);

  return (
    <Page fullWidth>
      <div className={darkMode ? "dashboard dark" : "dashboard"}>
        {/* Header */}
        <DashboardHeader
          lastUpdated={lastUpdated}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={handleRefresh}
          onToggleTheme={handleToggleTheme}
          loading={loading}
          isDarkTheme={darkMode}
        />

        {/* Error Display */}
        {(coreError || tablesError) && (
          <Box padding="400">
            <Text tone="critical">
              Error: {coreError || tablesError}
            </Text>
          </Box>
        )}

        {/* Metrics */}
        <div className="main-cards">
          <MetricCard
            title="Total Products"
            value={products.length}
            icon={ProductIcon}
            loading={coreLoading}
          />
          <MetricCard
            title="Total Orders"
            value={filteredOrders.length}
            icon={OrderIcon}
            loading={coreLoading}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={CashDollarIcon}
            loading={coreLoading}
          />
          <MetricCard
            title="Customers"
            value={customers.length}
            icon={PersonIcon}
            loading={coreLoading}
          />
        </div>

        {/* Chart */}
        <Card sectioned>
          <Text variant="headingMd" as="h2">
            Recent Order Totals
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Box paddingBlock="500" />

        {/* Tables */}
        <DashboardTable
          title="Best Selling Products"
          items={bestSelling}
          columns={[{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }]}
          rowRenderer={renderBestSellingRow}
          loading={tablesLoading}
          darkMode={darkMode}
        />

        <Box paddingBlock="400" />

        <DashboardTable
          title="Worst Selling Products"
          items={worstSelling}
          columns={[{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }]}
          rowRenderer={renderWorstSellingRow}
          loading={tablesLoading}
          darkMode={darkMode}
        />

        <Box paddingBlock="400" />

        <DashboardTable
          title="Pending / Unfulfilled Orders"
          items={pendingOrders}
          columns={[
            { title: "Order ID" },
            { title: "Value" },
            { title: "Customer" },
            { title: "Actions" },
          ]}
          rowRenderer={renderPendingOrdersRow}
          loading={tablesLoading}
          darkMode={darkMode}
        />

        <Box paddingBlock="400" />

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
          loading={tablesLoading}
          darkMode={darkMode}
        />

        {/* Order Modal */}
        {isOpen && activeOrder && (
          <Modal
            open={isOpen}
            onClose={closeModal}
            title={`Order ${activeOrder.id} Summary`}
            primaryAction={{ content: "Close", onAction: closeModal }}
          >
            <Modal.Section>
              <Text as="p">Customer: {activeOrder.customer}</Text>
              <Text as="p">Value: {activeOrder.value}</Text>
              <Text as="p">Summary: {activeOrder.summary}</Text>
              <Box paddingBlockStart="400">
                <Button
                  url={`https://admin.shopify.com/orders/${activeOrder.id}`}
                  target="_blank"
                >
                  View in Shopify
                </Button>
              </Box>
            </Modal.Section>
          </Modal>
        )}
      </div>

      {/* Inline styles for dark mode */}
      <style jsx>{`
        .dashboard {
          padding: 1rem;
          background: #f9fafb;
          color: #111827;
        }
        .dashboard.dark {
          background: #111827;
          color: #f9fafb;
        }
        .main-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .metric-card {
          background: var(--p-surface, white);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }
        .dashboard.dark .metric-card {
          background: #263043;
        }
        .metric-card-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .loading-placeholder {
          opacity: 0.5;
        }
      `}</style>
    </Page>
  );
};

export default Dashboard;
