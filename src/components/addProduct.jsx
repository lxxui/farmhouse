import React, { useState } from 'react';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    isNew: true,
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data:', product);
    // TODO: ส่งข้อมูลไป API
    alert('Product added successfully!');
    // reset form
    setProduct({
      name: '',
      price: '',
      category: '',
      description: '',
      isNew: true,
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label><br/>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label><br/>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label><br/>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label><br/>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isNew"
              checked={product.isNew}
              onChange={handleChange}
            />
            New Product
          </label>
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
