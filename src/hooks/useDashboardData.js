import { useState, useEffect, useCallback } from 'react';
import { getOrders, getProducts, getCustomers } from '../api/shopify';
import axios from 'axios';

/**
 * Custom hook for fetching and managing core dashboard data
 */
export const useDashboardData = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchCoreData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching core dashboard data...");
      
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        getOrders(),
        getProducts(),
        getCustomers(),
      ]);

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCustomers(customersRes.data || []);
      
      console.log("✅ Core data updated:", {
        orders: ordersRes.data?.length || 0,
        products: productsRes.data?.length || 0,
        customers: customersRes.data?.length || 0
      });
    } catch (error) {
      console.error("❌ Failed to fetch core data", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLastUpdated(new Date());
    fetchCoreData();
  }, [fetchCoreData]);

  useEffect(() => {
    // Initial fetch
    fetchCoreData();
    
    // Set up auto-refresh every 60 seconds
    const interval = setInterval(fetchCoreData, 60000);
    
    return () => clearInterval(interval);
  }, [fetchCoreData]);

  return {
    orders,
    products,
    customers,
    loading,
    lastUpdated,
    error,
    refreshData
  };
};

/**
 * Custom hook for fetching and managing dashboard table data
 */
export const useDashboardTables = () => {
  const [bestSelling, setBestSelling] = useState([]);
  const [worstSelling, setWorstSelling] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchTableData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching dashboard tables...");
      
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
      
      console.log("✅ Dashboard tables updated:", {
        bestSelling: bestRes.data?.data?.length || 0,
        worstSelling: worstRes.data?.data?.length || 0,
        pendingOrders: ordersRes.data?.data?.length || 0,
        lowStock: stockRes.data?.data?.length || 0
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Error fetching dashboard tables:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    setLastUpdated(new Date());
    fetchTableData();
  }, [fetchTableData]);

  useEffect(() => {
    // Initial fetch
    fetchTableData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchTableData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchTableData]);

  return {
    bestSelling,
    worstSelling,
    pendingOrders,
    lowStock,
    loading,
    lastUpdated,
    error,
    refreshData
  };
};
