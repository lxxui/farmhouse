import { useState, useEffect } from "react";

const MenuList = ({ setCategory }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // แยก state สำหรับ select

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error("categories ไม่ใช่ array:", data);
          setCategories([]);
        }
      })
      .catch((err) => console.error("โหลด categories error:", err));
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value); // update select
    setCategory(value); // ส่งค่าไป parent
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000); // simulate loading
  };

  return (
    <>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-8">
            <h4>รายการเมนู</h4>
          </div>
          <div className="col-md-4">
            <div className="filter-dropdown d-flex justify-content-end mb-3">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="form-select m-1 p-1"
              >
                <option value="">ทุกหมวด</option>
                {categories.map((cat) => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>
                    {cat.Icon} {cat.CategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div
          id="loading-spinner"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            padding: 20,
            borderRadius: 8,
          }}
        >
          <img
            src="../image/loading_bread.gif"
            alt="loading..."
            width="300"
            height="200"
          />
        </div>
      )}
    </>
  );
};

export default MenuList;
