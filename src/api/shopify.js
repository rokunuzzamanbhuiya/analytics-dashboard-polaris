// import axios from "axios";

// const API = "https://analytics-dashboard-back-esea.vercel.app/api";
// const API = "https://analytics-dashboard-backend-plum.vercel.app/api";
// const API = "http://localhost:3001/api";

// export const getOrders = () => axios.get(`${API}/orders`);
// export const getProducts = () => axios.get(`${API}/products`);
// export const getCustomers = () => axios.get(`${API}/customers`);

import axios from "axios";
import config from "../config/shopify";

// Backend API base URL
// Switch between production and local easily
const API = config.api.baseUrl;

// Orders
export const getOrders = () => axios.get(`${API}/orders`);
export const getPendingOrders = () => axios.get(`${API}/orders/pending`);

// Products
export const getProducts = () => axios.get(`${API}/products`);
export const getLowStockProducts = () => axios.get(`${API}/products/low-stock`);

// Customers
export const getCustomers = () => axios.get(`${API}/customers`);

// Sales stats
export const getBestSelling = () => axios.get(`${API}/best-selling`);
export const getWorstSelling = () => axios.get(`${API}/worst-selling`);

// Notifications
export const getNotifications = () => axios.get(`${API}/notifications`);
export const markNotificationAsRead = (id) => axios.patch(`${API}/notifications/${id}/read`);
export const archiveNotification = (id) => axios.patch(`${API}/notifications/${id}/archive`);
export const markAllNotificationsAsRead = () => axios.patch(`${API}/notifications/mark-all-read`);

// Authentication
export const logout = () => axios.post(`${API}/auth/logout`);