import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  IndexTable,
  Text,
  Link,
  Thumbnail,
  Button,
  Modal,
  Box,
  Spinner,
  Icon,
  Page,
  InlineStack,
  ButtonGroup,
  Select,
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
import { getOrders, getProducts, getCustomers } from "../api/shopify";
import axios from "axios";

const Dashboard = () => {
  // Core state
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Tables state
  const [bestSelling, setBestSelling] = useState([]);
  const [worstSelling, setWorstSelling] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [activeOrder, setActiveOrder] = useState(null);
  const handleOpen = useCallback((order) => setActiveOrder(order), []);
  const handleClose = useCallback(() => setActiveOrder(null), []);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Date filter
  const [dateRange, setDateRange] = useState("7d");

  // Fetch core data
  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          getOrders(),
          getProducts(),
          getCustomers(),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error("Failed to fetch core data", error);
      }
    }
    fetchData();
  }, []);

  // Fetch table data
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const [bestRes, worstRes, ordersRes, stockRes] = await Promise.all([
          axios.get("/api/best-selling"),
          axios.get("/api/worst-selling"),
          axios.get("/api/orders/pending"),
          axios.get("/api/products/low-stock"),
        ]);
        // Handle new API response format: {success: true, data: array, count: number, ...}
        setBestSelling(bestRes.data?.data || []);
        setWorstSelling(worstRes.data?.data || []);
        setPendingOrders(ordersRes.data?.data || []);
        setLowStock(stockRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching dashboard tables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // Filtered orders by date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const now = new Date();

    if (dateRange === "today") {
      return orderDate.toDateString() === now.toDateString();
    }
    if (dateRange === "7d") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return orderDate >= sevenDaysAgo;
    }
    return true; // all
  });

  // Calculate revenue
  useEffect(() => {
    const revenue = filteredOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_price || 0),
      0
    );
    setTotalRevenue(revenue);
  }, [filteredOrders]);

  const chartData = filteredOrders.map((order) => ({
    name: order.name,
    total: parseFloat(order.total_price || 0),
  }));

  // Table renderer
  const renderTable = (title, items, columns, rowRenderer) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
      <Card>
        <Box padding="400">
          <Text variant="headingMd" as="h2">
            {title}
          </Text>
        </Box>
        {loading ? (
          <Box padding="400" alignment="center">
            <Spinner accessibilityLabel="Loading data" size="large" />
          </Box>
        ) : safeItems.length === 0 ? (
          <Box padding="400">
            <Text as="p" tone="subdued">
              No data available
            </Text>
          </Box>
        ) : (
          <IndexTable
            resourceName={{ singular: "item", plural: "items" }}
            itemCount={safeItems.length}
            selectable={false}
            headings={columns}
          >
            {safeItems.map((item, index) => rowRenderer(item, index))}
          </IndexTable>
        )}
      </Card>
    );
  };

  return (
    <Page fullWidth>
      <div className={darkMode ? "dashboard dark" : "dashboard"}>
        {/* Header */}
        <InlineStack align="space-between" blockAlign="center" gap="400">
          <Text variant="headingXl" as="h1">
            Dashboard
          </Text>
          <InlineStack gap="400">
            <Select
              label=""
              labelHidden
              options={[
                { label: "Today", value: "today" },
                { label: "Last 7 days", value: "7d" },
                { label: "All", value: "all" },
              ]}
              value={dateRange}
              onChange={setDateRange}
            />
            <Button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </InlineStack>
        </InlineStack>

        {/* Metrics */}
        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>Total Products</h3>
              <Icon source={ProductIcon} />
            </div>
            <h1>{products.length}</h1>
          </div>

          <div className="card">
            <div className="card-inner">
              <h3>Total Orders</h3>
              <Icon source={OrderIcon} />
            </div>
            <h1>{filteredOrders.length}</h1>
          </div>

          <div className="card">
            <div className="card-inner">
              <h3>Total Revenue</h3>
              <Icon source={CashDollarIcon} />
            </div>
            <h1>${totalRevenue.toFixed(2)}</h1>
          </div>

          <div className="card">
            <div className="card-inner">
              <h3>Customers</h3>
              <Icon source={PersonIcon} />
            </div>
            <h1>{customers.length}</h1>
          </div>
        </div>

        {/* Chart */}
        <Card sectioned>
          <Text variant="headingMd" as="h2">
            Recent Order Totals
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(0, 10)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Box paddingBlock="500" />

        {/* Tables */}
        {renderTable(
          "Best Selling Products",
          bestSelling,
          [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
          (item, index) => (
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
          )
        )}

        <Box paddingBlock="400" />

        {renderTable(
          "Worst Selling Products",
          worstSelling,
          [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
          (item, index) => (
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
          )
        )}

        <Box paddingBlock="400" />

        {renderTable(
          "Pending / Unfulfilled Orders",
          pendingOrders,
          [
            { title: "Order ID" },
            { title: "Value" },
            { title: "Customer" },
            { title: "Actions" },
          ],
          (item, index) => (
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
                <Button size="slim" onClick={() => handleOpen(item)}>
                  View
                </Button>
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        )}

        <Box paddingBlock="400" />

        {renderTable(
          "Low Stock Alerts",
          lowStock,
          [
            { title: "Image" },
            { title: "Name" },
            { title: "Product ID" },
            { title: "Stock Qty" },
            { title: "Actions" },
          ],
          (item, index) => (
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
          )
        )}

        {/* Modal */}
        {activeOrder && (
          <Modal
            open={!!activeOrder}
            onClose={handleClose}
            title={`Order ${activeOrder.id} Summary`}
            primaryAction={{ content: "Close", onAction: handleClose }}
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
        .card {
          background: var(--p-surface, white);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }
        .dashboard.dark .card {
          background: #1f2937;
        }
        .card-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </Page>
  );
};

export default Dashboard;
