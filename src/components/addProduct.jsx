import React, { useState, useEffect } from "react";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    categoryId: "", // ✅ เก็บเป็น id ของ category
    description: "",
    isNew: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]); // ✅ เก็บ categories

  // โหลด categories จาก backend
  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("โหลด categories ผิดพลาด:", err));
  }, []);

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("categoryId", product.categoryId); // ✅ ส่ง categoryId ไป
    formData.append("description", product.description);
    formData.append("isNew", product.isNew);
    if (image) {
      formData.append("image", image);
    }

    console.log("ส่งข้อมูล:", formData);

    // TODO: ส่ง formData ไป API
    alert("Product added successfully!");

    // reset form
    setProduct({
      name: "",
      price: "",
      categoryId: "",
      description: "",
      isNew: true,
    });
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        {/* ✅ Category Select */}
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.CategoryID} value={cat.CategoryID}>
                {cat.CategoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isNew"
            checked={product.isNew}
            onChange={handleChange}
            className="form-check-input"
            id="isNewCheck"
          />
          <label className="form-check-label" htmlFor="isNewCheck">
            New Product
          </label>
        </div>

        {/* ✅ อัปโหลดรูป */}
        <div className="mb-3">
          <label className="form-label">Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
        </div>

        {preview && (
          <div
            className="image-box mx-auto mb-3"
            style={{
              width: 150,
              height: 150,
              overflow: "hidden",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <img
              src={preview}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
