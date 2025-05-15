import React, { createContext, useState } from 'react';
import { getUserOrders } from '../api/userServices';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  
  const refreshOrders = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const data = await getUserOrders(token);
      setOrders(data);
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders, refreshOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};