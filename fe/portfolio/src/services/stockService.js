import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/stocks';
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response ? error.response.data : error.message);
  throw new Error(error.response?.data?.message || defaultMessage);
};

export const getStocks = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch stocks. Please try again later.');
  }
};

export const getPortfolioValue = async () => {
  try {
    const response = await axios.get(`${apiUrl}/portfolio-value`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch portfolio value. Please try again later.');
  }
};

export const getTopGainers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/top-gainers`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch top gainers. Please try again later.');
  }
};

export const getTopLosers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/top-losers`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch top losers. Please try again later.');
  }
};
export const addStock = async (stock) => {
  if (!stock.name || !stock.ticker || isNaN(stock.buyPrice) || isNaN(stock.quantity)) {
    throw new Error('Invalid data: Make sure all fields are correctly filled.');
  }
  try {
    const response = await axios.post(apiUrl, stock);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add stock. Please try again later.');
  }
};

// Update a stock by ID
export const updateStock = async (id, stock) => {
  if (!id || !stock.name || !stock.ticker || isNaN(stock.buyPrice) || isNaN(stock.quantity)) {
    throw new Error('Invalid data: Make sure all fields are correctly filled.');
  }
  try {
    const response = await axios.put(`${apiUrl}/${id}`, stock);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update stock. Please try again later.');
  }
};
export const deleteStock = async (id) => {
  if (!id) {
    throw new Error('Invalid ID: Please provide a valid stock ID.');
  }
  try {
    await axios.delete(`${apiUrl}/${id}`);
  } catch (error) {
    handleApiError(error, 'Failed to delete stock. Please try again later.');
  }
};

export default {
  getStocks,
  getPortfolioValue,
  getTopGainers,
  getTopLosers,
  addStock,
  updateStock,
  deleteStock,
};