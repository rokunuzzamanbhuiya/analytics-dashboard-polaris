import axios from "axios";

// const API = "https://analytics-dashboard-back-esea.vercel.app/api";
const API = "https://analytics-dashboard-backend-plum.vercel.app/api";
// const API = "http://localhost:3001/api";

export const getOrders = () => axios.get(`${API}/orders`);
export const getProducts = () => axios.get(`${API}/products`);
export const getCustomers = () => axios.get(`${API}/customers`);
