import React, { useState, useEffect } from 'react';
import { addStock, updateStock, deleteStock, getStocks } from '../services/stockService';
import StockList from './StockList';

const StockForm = () => {
  const [form, setForm] = useState({ id: '', name: '', ticker: '', buyPrice: '', quantity: '' });
  const [stocks, setStocks] = useState([]);
  const [showStockList, setShowStockList] = useState(false);

  const fetchStocks = async () => {
    try {
      const response = await getStocks();
      setStocks(response);
    } catch (error) {
      console.error('Error fetching stocks:', error.message);
      alert('Failed to fetch stocks. Please try again later.');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const stockData = {
      name: form.name,
      ticker: form.ticker,
      buyPrice: parseFloat(form.buyPrice),
      quantity: parseInt(form.quantity),
    };

    if (isNaN(stockData.buyPrice) || isNaN(stockData.quantity)) {
      alert('Please enter valid numbers for Buy Price and Quantity.');
      return;
    }

    try {
      await addStock(stockData);
      await fetchStocks();
      setForm({ id: '', name: '', ticker: '', buyPrice: '', quantity: '' });
      alert('Stock added successfully!');
    } catch (error) {
      console.error('Error adding stock:', error.message);
      alert('Failed to add stock. Please try again later.');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!form.id) {
      alert('Please enter the stock ID to delete.');
      return;
    }

    try {
      await deleteStock(form.id);
      await fetchStocks();
      setForm({ id: '', name: '', ticker: '', buyPrice: '', quantity: '' });
      alert('Stock deleted successfully!');
    } catch (error) {
      console.error('Error deleting stock:', error.message);
      alert('Failed to delete stock. Please try again later.');
    }
  };

  const handleSaveStock = async (id, updatedStock) => {
    if (!updatedStock || !updatedStock.name || !updatedStock.ticker || !updatedStock.buyPrice || !updatedStock.quantity) {
      alert('Done! Please refresh the page to show updated version');
      return;
    }

    try {
      await updateStock(id, updatedStock);
      await fetchStocks();
      setForm({ id: '', name: '', ticker: '', buyPrice: '', quantity: '' });
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error.message);
      alert('Failed to update stock. Please try again later.');
    }
  };
  const handleEdit = (stock) => {
    setForm({
      id: stock.id.toString(),
      name: stock.name,
      ticker: stock.ticker,
      buyPrice: stock.buyPrice.toString(),
      quantity: stock.quantity.toString(),
    });
  };

  
  useEffect(() => {
    fetchStocks();
  }, []);

  return (
    <div>
      {/* Form to add, edit, and delete stocks */}
      <form className="stock-form">
        <div className="mb-3">
          <label htmlFor="id" className="form-label">Stock ID</label>
          <input
            type="number"
            className="form-control"
            id="id"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="Enter stock ID"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Stock name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ticker" className="form-label">Ticker</label>
          <input
            type="text"
            className="form-control"
            id="ticker"
            value={form.ticker}
            onChange={(e) => setForm({ ...form, ticker: e.target.value })}
            placeholder="Ticker symbol"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="buyPrice" className="form-label">Buy Price</label>
          <input
            type="number"
            className="form-control"
            id="buyPrice"
            value={form.buyPrice}
            onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
            placeholder="Buy price"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="Quantity"
          />
        </div>

        <div className="form-buttons">
          <button type="button" onClick={handleAdd} className="btn btn-primary">Add Stock</button>
          <button type="button" onClick={handleDelete} className="btn btn-danger">Delete Stock</button>
          <button type="button" onClick={() => setShowStockList(!showStockList)} className="btn btn-info">
            {showStockList ? 'Hide Stocks' : 'View Stocks'}
          </button>
        </div>
      </form>

      {/* Display stock list if showStockList is true */}
      {showStockList && (
      <StockList 
      stocks={stocks} 
      onEdit={handleEdit} 
      onSave={handleSaveStock} 
      onDelete={handleDelete}
    />
  )}
</div>
  );
};

export default StockForm;