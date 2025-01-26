import React, { useState, useEffect } from 'react';
import StockForm from './StockForm';
import StockList from './StockList';
import { getStocks, getPortfolioValue, getTopGainers, getTopLosers } from '../services/stockService';
import '../App.css';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [sectorAllocation, setSectorAllocation] = useState([]);
  const [showStockList, setShowStockList] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await fetchStocks();
      await fetchPortfolioValue();
      await fetchTopGainers();
      await fetchTopLosers();
    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('Unable to fetch data. Please try again later.');
    }
  };

  const fetchStocks = async () => {
    try {
      const response = await getStocks();
      if (response) {
        setStocks(response.stocks || []);
        calculateSectorAllocation(response.stocks || []);
      } else {
        console.error('No response data received from the API.');
      }
    } catch (error) {
      console.error('Error fetching stocks:', error.message);
    }
  };

  const fetchPortfolioValue = async () => {
    try {
      const response = await getPortfolioValue();
      setPortfolioValue(response.portfolioValue || 0);
    } catch (error) {
      console.error('Error fetching portfolio value:', error.message);
    }
  };

  const fetchTopGainers = async () => {
    try {
      const response = await getTopGainers();
      setTopGainers(response || []);
    } catch (error) {
      console.error('Error fetching top gainers:', error.message);
    }
  };

  const fetchTopLosers = async () => {
    try {
      const response = await getTopLosers();
      setTopLosers(response || []);
    } catch (error) {
      console.error('Error fetching top losers:', error.message);
    }
  };

  const calculateSectorAllocation = (stocks) => {
    const sectorMap = stocks.reduce((acc, stock) => {
      acc[stock.sector] = (acc[stock.sector] || 0) + stock.currentValue;
      return acc;
    }, {});

    setSectorAllocation(Object.entries(sectorMap));
  };

  const handleShowStockListToggle = () => {
    setShowStockList(!showStockList);
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Stock Portfolio Dashboard</h1>
        <h2>Portfolio Value: ${portfolioValue.toFixed(2)}</h2>
      </header>

      <div className="metrics-section">
        <div className="top-stocks">
          <h3>Top Gainers</h3>
          <ul>
            {topGainers.length > 0 ? (
              topGainers.map(stock => (
                <li key={stock.id}>{stock.name} ({stock.ticker}): +{stock.changePercentage}%</li>
              ))
            ) : (
              <li>No gainers available</li>
            )}
          </ul>
        </div>

        <div className="top-stocks">
          <h3>Top Losers</h3>
          <ul>
            {topLosers.length > 0 ? (
              topLosers.map(stock => (
                <li key={stock.id}>{stock.name} ({stock.ticker}): {stock.changePercentage}%</li>
              ))
            ) : (
              <li>No losers available</li>
            )}
          </ul>
        </div>

        <div className="sector-allocation">
          <h3>Sector Allocation</h3>
          <ul>
            {sectorAllocation.length > 0 ? (
              sectorAllocation.map(([sector, value]) => (
                <li key={sector}>{sector}: ${value.toFixed(2)}</li>
              ))
            ) : (
              <li>No sector data available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Stock Form for adding, updating, and deleting stocks */}
      <StockForm fetchStocks={fetchAllData} />
      {showStockList && <StockList stocks={stocks} />}
    </div>
  );
};

export default Dashboard;