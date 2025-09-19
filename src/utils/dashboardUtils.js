/**
 * Utility functions for dashboard data processing
 */

/**
 * Filter orders by date range
 */
export const filterOrdersByDateRange = (orders, dateRange) => {
  if (!Array.isArray(orders)) return [];
  
  const now = new Date();
  
  return orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    
    switch (dateRange) {
      case "today":
        return orderDate.toDateString() === now.toDateString();
      case "7d":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      case "all":
      default:
        return true;
    }
  });
};

/**
 * Calculate total revenue from orders
 */
export const calculateTotalRevenue = (orders) => {
  if (!Array.isArray(orders)) return 0;
  
  return orders.reduce((sum, order) => {
    return sum + parseFloat(order.total_price || 0);
  }, 0);
};

/**
 * Generate chart data from orders
 */
export const generateChartData = (orders, limit = 10) => {
  if (!Array.isArray(orders)) return [];
  
  return orders.slice(0, limit).map((order) => ({
    name: order.name,
    total: parseFloat(order.total_price || 0),
  }));
};

/**
 * Format currency value
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time for display
 */
export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
