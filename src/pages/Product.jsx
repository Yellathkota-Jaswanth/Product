import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
function Product() {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  if(!location.state.loggedInUser){
    navigate('/login')
  }
  const user = JSON.parse(localStorage.getItem('user'));
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', inventoryCount: 0 });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', inventoryCount: 0 });

  useEffect(() => {
    if (user.role !== 'staff') fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch {
      alert('Access denied');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await api.post('/products', formData);
      fetchProducts();
    } catch {
      alert('Only admins can create products');
    }
  };

  const handleEditClick = (prod) => {
    setEditId(prod._id);
    setEditData({ title: prod.title, description: prod.description, inventoryCount: prod.inventoryCount });
  };

  const handleSaveClick = async (id) => {
    try {
      await api.put(`/products/${id}`, editData);
      setEditId(null);
      fetchProducts();
    } catch {
      alert('Only admin or manager can update');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert('Only admins can delete');
    }
  };

  return (
    <div>
      <h2>Product Dashboard ({user.role})</h2>

      {user.role === 'admin' && (
        <div className='table'>
          <input name="title" placeholder="Title" onChange={handleChange} />
          <input name="description" placeholder="Description" onChange={handleChange} />
          <input name="inventoryCount" type="number" placeholder="Inventory" onChange={handleChange} />
          <button onClick={handleCreate} className='product-btn'>Create Product</button>
        </div>
      )}

      <table border="1" className='crud-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Inventory</th>
            {(user.role !== 'staff') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod._id}>
              {editId === prod._id ? (
                <>
                  <td><input name="title" value={editData.title} onChange={handleEditChange} /></td>
                  <td><input name="description" value={editData.description} onChange={handleEditChange} /></td>
                  <td><input name="inventoryCount" type="number" value={editData.inventoryCount} onChange={handleEditChange} /></td>
                  <td>
                    <button className="update" onClick={() => handleSaveClick(prod._id)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{prod.title}</td>
                  <td>{prod.description}</td>
                  <td>{prod.inventoryCount}</td>
                  {(user.role !== 'staff') && (
                    <td>
                      <button className='update' onClick={() => handleEditClick(prod)}>Update</button>
                      {(user.role === 'admin') && <button className='delete' onClick={() => handleDelete(prod._id)}>Delete</button>}
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Product;
