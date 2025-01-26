import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockList = ({ stocks, setStocks, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editableStock, setEditableStock] = useState({});

  useEffect(() => {
    if (editingId !== null) {
      axios.get(`http://localhost:8080/api/stocks/${editingId}`)
        .then(res => {
          setEditableStock(res.data || {});
        })
        .catch(err => {
          console.error("Failed to fetch stock data for editing:", err);
        });
    }
  }, [editingId]);

  const handleEdit = (stock) => {
    setEditingId(stock.id);
  };

  const handleDeleteStock = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      axios.delete(`http://localhost:8080/api/stocks/${id}`)
        .then(() => {
          setStocks(prevStocks => prevStocks.filter(stock => stock.id !== id));
          alert("successfully deleted")
        })
        .catch(err => {
          console.error(`Failed to delete stock with ID ${id}:`, err);
          alert("Deleted! please refresh the page");
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableStock(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (Object.keys(editableStock).length > 0) {
      axios.put(`http://localhost:8080/api/stocks/${editableStock.id}`, editableStock)
        .then(response => {
          console.log("Stock updated successfully:", response.data);
          onSave(response.data);
          setEditingId(null);
        })
        .catch(err => {
          console.error("Failed to update stock:", err);
          alert("Failed to update stock. Please try again.");
        });
    } else {
      alert("Please make changes before saving.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditableStock({});
  };

  return (
    <div>
      <h3>Stock List</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Ticker</th>
            <th>Buy Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks && stocks.length > 0 ? (
            stocks.map((stock) => (
              <tr key={stock.id}>
                {editingId === stock.id ? (
                  <>
                    <td>{stock.id}</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editableStock.name || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="ticker"
                        value={editableStock.ticker || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="buyPrice"
                        value={editableStock.buyPrice || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={editableStock.quantity || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={handleSave}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{stock.id}</td>
                    <td>{stock.name}</td>
                    <td>{stock.ticker}</td>
                    <td>${stock.buyPrice.toFixed(2)}</td>
                    <td>{stock.quantity}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(stock)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteStock(stock.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;