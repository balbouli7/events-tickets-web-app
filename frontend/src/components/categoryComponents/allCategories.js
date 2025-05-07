import useCategories from "../useCategory";

const AllCategories = () => {
  const { categories, error } = useCategories();

  return (
    <div>
      <h2>Categories</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {categories.map((cat) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};
export default AllCategories;