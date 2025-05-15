// hooks/useCategories.js
import { useEffect, useState } from "react";
import { getAllCategories } from "../api/userServices";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      
      try {
        const token = sessionStorage.getItem("token");
        const data = await getAllCategories(token);
        setCategories(data);
      } catch (err) {
        setError(err.message || "Failed to fetch categories");
      }
    };
    fetch();
  }, []);

  return { categories, error };
};

export default useCategories;
