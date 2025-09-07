import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
} from "@shopify/polaris";

const DashboardTables = () => {
  // --- State ---
  const [bestSelling, setBestSelling] = useState([]);
  const [worstSelling, setWorstSelling] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [activeOrder, setActiveOrder] = useState(null);
  const handleOpen = useCallback((order) => setActiveOrder(order), []);
  const handleClose = useCallback(() => setActiveOrder(null), []);

  // --- Fetch data from backend / Shopify ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [bestRes, worstRes, ordersRes, stockRes] = await Promise.all([
          axios.get("/api/best-selling"),
          axios.get("/api/worst-selling"),
          axios.get("/api/orders/pending"),
          axios.get("/api/products/low-stock"),
        ]);

        setBestSelling(bestRes.data || []);
        setWorstSelling(worstRes.data || []);
        setPendingOrders(ordersRes.data || []);
        setLowStock(stockRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Table Renderer ---
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
    <>
      <div style={{ width: "100%", padding: "1rem" }}>
        {/* Best Selling */}
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
                  url={`https://admin.shopify.com/products/${item.id}`}
                  target="_blank"
                >
                  {item.id}
                </Link>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Button
                  url={`https://admin.shopify.com/products/${item.id}`}
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

        {/* Worst Selling */}
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
                  url={`https://admin.shopify.com/products/${item.id}`}
                  target="_blank"
                >
                  {item.id}
                </Link>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Button
                  url={`https://admin.shopify.com/products/${item.id}`}
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

        {/* Pending Orders */}
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

        {/* Low Stock Alerts */}
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
                  url={`https://admin.shopify.com/products/${item.id}`}
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
                  url={`https://admin.shopify.com/products/${item.id}`}
                  target="_blank"
                  size="slim"
                >
                  View
                </Button>
              </IndexTable.Cell>
            </IndexTable.Row>
          )
        )}

        {/* Modal for order summary */}
        {activeOrder && (
          <Modal
            open={!!activeOrder}
            onClose={handleClose}
            title={`Order ${activeOrder.id} Summary`}
            primaryAction={{
              content: "Close",
              onAction: handleClose,
            }}
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
    </>
  );
};

export default DashboardTables;
