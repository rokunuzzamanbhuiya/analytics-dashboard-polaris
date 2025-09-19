import { useState, useCallback } from 'react';

/**
 * Custom hook for managing order modal state and actions
 */
export const useOrderModal = () => {
  const [activeOrder, setActiveOrder] = useState(null);

  const openModal = useCallback((order) => {
    setActiveOrder(order);
  }, []);

  const closeModal = useCallback(() => {
    setActiveOrder(null);
  }, []);

  const isOpen = Boolean(activeOrder);

  return {
    activeOrder,
    isOpen,
    openModal,
    closeModal
  };
};
