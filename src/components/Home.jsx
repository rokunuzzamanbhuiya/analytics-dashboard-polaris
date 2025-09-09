import React, { useEffect, useState } from "react";
import { getOrders, getProducts, getCustomers } from "../api/shopify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsCurrencyDollar,
} from "react-icons/bs";
import { Icon } from "@shopify/polaris";
import {
  ProductIcon,
  OrderIcon,
  CashDollarIcon,
  PersonIcon,
} from "@shopify/polaris-icons";
import Dashboard from "./Dashboard";
import DashboardTables from "./DashboardTables";
// import OrderNotifications from "./OrderNotifications";

function Home() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

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

        const revenue = ordersRes.data.reduce(
          (sum, order) => sum + parseFloat(order.total_price),
          0
        );
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    // Fetch initially
    fetchData();

    // Set interval every 2 seconds
    const interval = setInterval(fetchData, 2000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const chartData = orders.map((order) => ({
    name: order.name,
    total: parseFloat(order.total_price),
  }));

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
        {/* <span className="badge">Live</span> */}
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Total Products</h3>
            <Icon source={ProductIcon} tone="base" />
          </div>
          <h1>{products.length}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Total Orders</h3>
            <Icon source={OrderIcon} tone="base" />
          </div>
          <h1>{orders.length}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Total Revenue</h3>
            <Icon source={CashDollarIcon} tone="base" />
          </div>
          <h1>${totalRevenue.toFixed(2)}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>Customers</h3>
            <Icon source={PersonIcon} tone="base" />
          </div>
          <h1>{customers.length}</h1>
        </div>
      </div>

      <h2 className="charts-title">Recent Order Totals</h2>
      <div className="charts">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.slice(0, 10)}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DashboardTables />
      {/* <OrderNotifications /> */}
    </main>
  );
}

export default Home;
