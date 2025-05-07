import React, { useState, useEffect } from 'react';
import { createCategory, getAllCategories } from '../../api/userServices';

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCategory(categoryData);
      alert(response.message);
    //   fetchCategories();
    } catch (error) {
      alert('Error creating category');
    }
  };


  return (
    <div>
      <h2>Create a Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create Category</button>
      </form>

      <h3>Categories List</h3>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <strong>{category.name}</strong>: {category.description || 'No description'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory ;