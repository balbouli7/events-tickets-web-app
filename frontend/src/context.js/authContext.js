import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); 
    }
  }, []);

  const setUserHandler = (user) => {
    setUser(user);
    setIsLoggedIn(true);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    sessionStorage.setItem("token", userData.token);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  if (isLoggedIn === null) return null;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setUser: setUserHandler, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
