// import React, { useEffect, useState } from "react";
// import { getOrders, getProducts, getCustomers } from "../api/shopify";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function Dashboard() {
//   const [orders, setOrders] = useState([]);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const ordersRes = await getOrders();
//       const productsRes = await getProducts();
//       const customersRes = await getCustomers();

//       setOrders(ordersRes.data);
//       setProducts(productsRes.data);
//       setCustomers(customersRes.data);

//       const revenue = ordersRes.data.reduce(
//         (sum, order) => sum + parseFloat(order.total_price),
//         0
//       );
//       setTotalRevenue(revenue);
//     }

//     fetchData();
//   }, []);

//   const chartData = orders.map((order) => ({
//     name: order.name,
//     total: parseFloat(order.total_price),
//   }));

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Shopify Analytics Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="p-4 bg-white shadow rounded">
//           Total Products: {products.length}
//         </div>

//         <div className="p-4 bg-white shadow rounded">
//           Total Orders: {orders.length}
//         </div>
//         <div className="p-4 bg-white shadow rounded">
//           Total Revenue: ${totalRevenue.toFixed(2)}
//         </div>
//         <div className="p-4 bg-white shadow rounded">
//           Customers: {customers.length}
//         </div>
//       </div>

//       <h2 className="text-xl font-semibold mb-2">Recent Order Totals</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData.slice(0, 10)}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="total" fill="#3b82f6" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { getOrders, getProducts, getCustomers } from "../api/shopify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Replace with your backend server address
// const SOCKET_SERVER_URL = "http://localhost:3001";
const SOCKET_SERVER_URL = "https://analytics-dashboard-backend-plum.vercel.app";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        getOrders(),
        getProducts(),
        getCustomers(),
      ]);

      const orderList = ordersRes.data || [];

      setOrders(orderList);
      setProducts(productsRes.data || []);
      setCustomers(customersRes.data || []);

      const revenue = orderList.reduce(
        (sum, order) => sum + parseFloat(order.total_price || 0),
        0
      );
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    socket.on("new-order", (newOrder) => {
      console.log("📦 New order received via WebSocket", newOrder);

      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders];
        const revenue = updatedOrders.reduce(
          (sum, order) => sum + parseFloat(order.total_price || 0),
          0
        );
        setTotalRevenue(revenue);
        return updatedOrders;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = orders.map((order) => ({
    name: order.name,
    total: parseFloat(order.total_price || 0),
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Shopify Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded">
          Total Products: {products.length}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Total Orders: {orders.length}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Total Revenue: ${totalRevenue.toFixed(2)}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Customers: {customers.length}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Order Totals</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData.slice(0, 10)}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
