// context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./authContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      if (isLoggedIn && user) {
        const newSocket = io("http://localhost:5000", {
          autoConnect: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
  
        const onConnect = () => {
          console.log("Socket connected:", newSocket.id);
          if (user.role === "admin") {
            newSocket.emit("registerAdmin", user.id);
            newSocket.emit("joinAdminRoom");
          }
        };
  
        newSocket.on('connect', onConnect);
  
        setSocket(newSocket);
  
        return () => {
          newSocket.off('connect', onConnect);
          newSocket.disconnect();
          setSocket(null);
        };
      }
    }, [isLoggedIn, user?._id, user?.role]); // Only depend on relevant user properties
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
