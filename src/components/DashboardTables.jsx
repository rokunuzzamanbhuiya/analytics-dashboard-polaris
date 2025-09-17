// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import {
//   Card,
//   IndexTable,
//   Text,
//   Link,
//   Thumbnail,
//   Button,
//   Modal,
//   Box,
//   Spinner,
// } from "@shopify/polaris";

// const DashboardTables = () => {
//   // --- State ---
//   const [bestSelling, setBestSelling] = useState([]);
//   const [worstSelling, setWorstSelling] = useState([]);
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [activeOrder, setActiveOrder] = useState(null);
//   const handleOpen = useCallback((order) => setActiveOrder(order), []);
//   const handleClose = useCallback(() => setActiveOrder(null), []);

//   // --- Fetch data from backend / Shopify ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [bestRes, worstRes, ordersRes, stockRes] = await Promise.all([
//           axios.get("/api/best-selling"),
//           axios.get("/api/worst-selling"),
//           axios.get("/api/orders/pending"),
//           axios.get("/api/products/low-stock"),
//         ]);

//         setBestSelling(bestRes.data || []);
//         setWorstSelling(worstRes.data || []);
//         setPendingOrders(ordersRes.data || []);
//         setLowStock(stockRes.data || []);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // --- Table Renderer ---
//   const renderTable = (title, items, columns, rowRenderer) => {
//     const safeItems = Array.isArray(items) ? items : [];

//     return (
//       <Card>
//         <Box padding="400">
//           <Text variant="headingMd" as="h2">
//             {title}
//           </Text>
//         </Box>
//         {loading ? (
//           <Box padding="400" alignment="center">
//             <Spinner accessibilityLabel="Loading data" size="large" />
//           </Box>
//         ) : safeItems.length === 0 ? (
//           <Box padding="400">
//             <Text as="p" tone="subdued">
//               No data available
//             </Text>
//           </Box>
//         ) : (
//           <IndexTable
//             resourceName={{ singular: "item", plural: "items" }}
//             itemCount={safeItems.length}
//             selectable={false}
//             headings={columns}
//           >
//             {safeItems.map((item, index) => rowRenderer(item, index))}
//           </IndexTable>
//         )}
//       </Card>
//     );
//   };

//   return (
//     <>
//       <div style={{ width: "100%", padding: "1rem" }}>
//         {/* Best Selling */}
//         {renderTable(
//           "Best Selling Products",
//           bestSelling,
//           [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
//           (item, index) => (
//             <IndexTable.Row id={item.id} key={item.id} position={index}>
//               <IndexTable.Cell>
//                 <Text>{item.name}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Link
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                 >
//                   {item.id}
//                 </Link>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Button
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                   size="slim"
//                 >
//                   View
//                 </Button>
//               </IndexTable.Cell>
//             </IndexTable.Row>
//           )
//         )}

//         <Box paddingBlock="400" />

//         {/* Worst Selling */}
//         {renderTable(
//           "Worst Selling Products",
//           worstSelling,
//           [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
//           (item, index) => (
//             <IndexTable.Row id={item.id} key={item.id} position={index}>
//               <IndexTable.Cell>
//                 <Text>{item.name}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Link
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                 >
//                   {item.id}
//                 </Link>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Button
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                   size="slim"
//                 >
//                   View
//                 </Button>
//               </IndexTable.Cell>
//             </IndexTable.Row>
//           )
//         )}

//         <Box paddingBlock="400" />

//         {/* Pending Orders */}
//         {renderTable(
//           "Pending / Unfulfilled Orders",
//           pendingOrders,
//           [
//             { title: "Order ID" },
//             { title: "Value" },
//             { title: "Customer" },
//             { title: "Actions" },
//           ],
//           (item, index) => (
//             <IndexTable.Row id={item.id} key={item.id} position={index}>
//               <IndexTable.Cell>
//                 <Link
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                 >
//                   {item.id}
//                 </Link>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Text>{item.value}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Text>{item.customer}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Button size="slim" onClick={() => handleOpen(item)}>
//                   View
//                 </Button>
//               </IndexTable.Cell>
//             </IndexTable.Row>
//           )
//         )}

//         <Box paddingBlock="400" />

//         {/* Low Stock Alerts */}
//         {renderTable(
//           "Low Stock Alerts",
//           lowStock,
//           [
//             { title: "Image" },
//             { title: "Name" },
//             { title: "Product ID" },
//             { title: "Stock Qty" },
//             { title: "Actions" },
//           ],
//           (item, index) => (
//             <IndexTable.Row id={item.id} key={item.id} position={index}>
//               <IndexTable.Cell>
//                 <Thumbnail source={item.image} alt={item.name} size="small" />
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Text>{item.name}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Link
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                 >
//                   {item.id}
//                 </Link>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Text>{item.stock}</Text>
//               </IndexTable.Cell>
//               <IndexTable.Cell>
//                 <Button
//                   url={`https://themes-five.myshopify.com/${item.id}`}
//                   target="_blank"
//                   size="slim"
//                 >
//                   View
//                 </Button>
//               </IndexTable.Cell>
//             </IndexTable.Row>
//           )
//         )}

//         {/* Modal for order summary */}
//         {activeOrder && (
//           <Modal
//             open={!!activeOrder}
//             onClose={handleClose}
//             title={`Order ${activeOrder.id} Summary`}
//             primaryAction={{
//               content: "Close",
//               onAction: handleClose,
//             }}
//           >
//             <Modal.Section>
//               <Text as="p">Customer: {activeOrder.customer}</Text>
//               <Text as="p">Value: {activeOrder.value}</Text>
//               <Text as="p">Summary: {activeOrder.summary}</Text>
//               <Box paddingBlockStart="400">
//                 <Button
//                   url={`https://themes-five.myshopify.com/${activeOrder.id}`}
//                   target="_blank"
//                 >
//                   View in Shopify
//                 </Button>
//               </Box>
//             </Modal.Section>
//           </Modal>
//         )}
//       </div>
//     </>
//   );
// };

// export default DashboardTables;

// ==============================================
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Card,
//   IndexTable,
//   Text,
//   Link,
//   Thumbnail,
//   Button,
//   Modal,
//   Box,
//   Spinner,
// } from "@shopify/polaris";

// const DashboardTables = () => {
//   // --- State ---
//   const [bestSelling, setBestSelling] = useState([]);
//   const [worstSelling, setWorstSelling] = useState([]);
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [lowStock, setLowStock] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [activeOrder, setActiveOrder] = useState(null);
//   const handleOpen = useCallback((order) => setActiveOrder(order), []);
//   const handleClose = useCallback(() => setActiveOrder(null), []);

//   // --- Load fake data ---
//   useEffect(() => {
//     setLoading(true);

//     setTimeout(() => {
//       // ✅ Fake Best Selling
//       setBestSelling([
//         { id: "P1001", name: "T-Shirt Classic" },
//         { id: "P1002", name: "Leather Wallet" },
//         { id: "P1003", name: "Sports Shoes" },
//       ]);

//       // ✅ Fake Worst Selling
//       setWorstSelling([
//         { id: "P2001", name: "Winter Jacket" },
//         { id: "P2002", name: "Silk Tie" },
//         { id: "P2003", name: "Wool Hat" },
//       ]);

//       // ✅ Fake Pending Orders
//       setPendingOrders([
//         {
//           id: "O5001",
//           value: "$120.00",
//           customer: "John Doe",
//           summary: "2x T-Shirt, 1x Wallet",
//         },
//         {
//           id: "O5002",
//           value: "$250.00",
//           customer: "Jane Smith",
//           summary: "1x Jacket, 2x Shoes",
//         },
//       ]);

//       // ✅ Fake Low Stock
//       setLowStock([
//         {
//           id: "P3001",
//           name: "Sunglasses",
//           stock: 3,
//           image:
//             "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/sunglasses.jpg",
//         },
//         {
//           id: "P3002",
//           name: "Backpack",
//           stock: 5,
//           image:
//             "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/backpack.jpg",
//         },
//       ]);

//       setLoading(false);
//     }, 1000); // simulate API delay
//   }, []);

//   // --- Table Renderer ---
//   const renderTable = (title, items, columns, rowRenderer) => {
//     const safeItems = Array.isArray(items) ? items : [];

//     return (
//       <Card>
//         <Box padding="400">
//           <Text variant="headingMd" as="h2">
//             {title}
//           </Text>
//         </Box>
//         {loading ? (
//           <Box padding="400" alignment="center">
//             <Spinner accessibilityLabel="Loading data" size="large" />
//           </Box>
//         ) : safeItems.length === 0 ? (
//           <Box padding="400">
//             <Text as="p" tone="subdued">
//               No data available
//             </Text>
//           </Box>
//         ) : (
//           <IndexTable
//             resourceName={{ singular: "item", plural: "items" }}
//             itemCount={safeItems.length}
//             selectable={false}
//             headings={columns}
//           >
//             {safeItems.map((item, index) => rowRenderer(item, index))}
//           </IndexTable>
//         )}
//       </Card>
//     );
//   };

//   return (
//     <div style={{ width: "100%", padding: "1rem" }}>
//       {/* Best Selling */}
//       {renderTable(
//         "Best Selling Products",
//         bestSelling,
//         [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
//         (item, index) => (
//           <IndexTable.Row id={item.id} key={item.id} position={index}>
//             <IndexTable.Cell>
//               <Text>{item.name}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Link
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//               >
//                 {item.id}
//               </Link>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Button
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//                 size="slim"
//               >
//                 View
//               </Button>
//             </IndexTable.Cell>
//           </IndexTable.Row>
//         )
//       )}

//       <Box paddingBlock="400" />

//       {/* Worst Selling */}
//       {renderTable(
//         "Worst Selling Products",
//         worstSelling,
//         [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
//         (item, index) => (
//           <IndexTable.Row id={item.id} key={item.id} position={index}>
//             <IndexTable.Cell>
//               <Text>{item.name}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Link
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//               >
//                 {item.id}
//               </Link>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Button
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//                 size="slim"
//               >
//                 View
//               </Button>
//             </IndexTable.Cell>
//           </IndexTable.Row>
//         )
//       )}

//       <Box paddingBlock="400" />

//       {/* Pending Orders */}
//       {renderTable(
//         "Pending / Unfulfilled Orders",
//         pendingOrders,
//         [
//           { title: "Order ID" },
//           { title: "Value" },
//           { title: "Customer" },
//           { title: "Actions" },
//         ],
//         (item, index) => (
//           <IndexTable.Row id={item.id} key={item.id} position={index}>
//             <IndexTable.Cell>
//               <Link
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//               >
//                 {item.id}
//               </Link>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Text>{item.value}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Text>{item.customer}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Button size="slim" onClick={() => handleOpen(item)}>
//                 View
//               </Button>
//             </IndexTable.Cell>
//           </IndexTable.Row>
//         )
//       )}

//       <Box paddingBlock="400" />

//       {/* Low Stock Alerts */}
//       {renderTable(
//         "Low Stock Alerts",
//         lowStock,
//         [
//           { title: "Image" },
//           { title: "Name" },
//           { title: "Product ID" },
//           { title: "Stock Qty" },
//           { title: "Actions" },
//         ],
//         (item, index) => (
//           <IndexTable.Row id={item.id} key={item.id} position={index}>
//             <IndexTable.Cell>
//               <Thumbnail source={item.image} alt={item.name} size="small" />
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Text>{item.name}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Link
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//               >
//                 {item.id}
//               </Link>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Text>{item.stock}</Text>
//             </IndexTable.Cell>
//             <IndexTable.Cell>
//               <Button
//                 url={`https://themes-five.myshopify.com/${item.id}`}
//                 target="_blank"
//                 size="slim"
//               >
//                 View
//               </Button>
//             </IndexTable.Cell>
//           </IndexTable.Row>
//         )
//       )}

//       {/* Modal for order summary */}
//       {activeOrder && (
//         <Modal
//           open={!!activeOrder}
//           onClose={handleClose}
//           title={`Order ${activeOrder.id} Summary`}
//           primaryAction={{
//             content: "Close",
//             onAction: handleClose,
//           }}
//         >
//           <Modal.Section>
//             <Text as="p">Customer: {activeOrder.customer}</Text>
//             <Text as="p">Value: {activeOrder.value}</Text>
//             <Text as="p">Summary: {activeOrder.summary}</Text>
//             <Box paddingBlockStart="400">
//               <Button
//                 url={`https://themes-five.myshopify.com/${activeOrder.id}`}
//                 target="_blank"
//               >
//                 View in Shopify
//               </Button>
//             </Box>
//           </Modal.Section>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default DashboardTables;

// ===============================================

import React, { useState, useEffect, useCallback } from "react";
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
import {
  getBestSelling,
  getWorstSelling,
  getPendingOrders,
  getLowStockProducts,
} from "../api/shopify";
// import "./DashboardTables.css"; // import CSS file for table overrides

const DashboardTables = () => {
  const [bestSelling, setBestSelling] = useState([]);
  const [worstSelling, setWorstSelling] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeOrder, setActiveOrder] = useState(null);
  const handleOpen = useCallback((order) => setActiveOrder(order), []);
  const handleClose = useCallback(() => setActiveOrder(null), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching dashboard data...");
        
        const [bestRes, worstRes, ordersRes, stockRes] = await Promise.all([
          getBestSelling(),
          getWorstSelling(),
          getPendingOrders(),
          getLowStockProducts(),
        ]);
        
        console.log("📊 API Responses:", {
          bestSelling: bestRes.data,
          worstSelling: worstRes.data,
          pendingOrders: ordersRes.data,
          lowStock: stockRes.data
        });
        
        // Handle new API response format: {success: true, data: array, count: number, ...}
        setBestSelling(bestRes.data?.data || []);
        setWorstSelling(worstRes.data?.data || []);
        setPendingOrders(ordersRes.data?.data || []);
        setLowStock(stockRes.data?.data || []);
        
        console.log("✅ Data set successfully");
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const renderTable = (title, items, columns, rowRenderer) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
      <div className="dashboard-table-card">
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
          <div className="dashboard-table">
            <IndexTable
              resourceName={{ singular: "item", plural: "items" }}
              itemCount={safeItems.length}
              selectable={false}
              headings={columns}
            >
              {safeItems.map((item, index) => rowRenderer(item, index))}
            </IndexTable>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="dashboard-tables"
      style={{ width: "100%", padding: "1rem" }}
    >
      {/* Best Selling */}
      {renderTable(
        "Best Selling Products",
        bestSelling,
        [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
        (item, index) => (
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
        )
      )}

      <Box paddingBlock="400" />

      {/* Worst Selling */}
      {renderTable(
        "Worst Selling Products",
        worstSelling,
        [{ title: "Name" }, { title: "Product ID" }, { title: "Actions" }],
        (item, index) => (
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
          { title: "Customer Name" },
          { title: "Actions" },
        ],
        (item, index) => (
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
              <Button size="slim" onClick={() => handleOpen(item)}>
                View
              </Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        )
      )}

      <Box paddingBlock="400" />

      {/* Low Stock */}
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
        )
      )}

      {/* Order Modal */}
      {activeOrder && (
        <Modal
          open={!!activeOrder}
          onClose={handleClose}
          title={`Order ${activeOrder.order_number || activeOrder.name} Summary`}
          primaryAction={{
            content: "Close",
            onAction: handleClose,
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
                <strong>Created:</strong> {new Date(activeOrder.created_at).toLocaleDateString()}
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
