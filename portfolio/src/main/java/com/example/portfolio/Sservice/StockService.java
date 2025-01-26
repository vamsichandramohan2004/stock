package com.example.portfolio.Sservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.portfolio.Srepository.StockRepository;
import com.example.portfolio.Smodel.Stock;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import org.springframework.util.ReflectionUtils;
import jakarta.transaction.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.lang.reflect.Field;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }
    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findById(id);
    }
    public Stock saveStock(Stock stock) {
        if (stock.getId() != null && stockRepository.existsById(stock.getId())) {
            return updateStock(stock.getId().longValue(), stock);
        } else {
            return addStock(stock);
        }
    }
    public Stock addStock(Stock stock) {
        if (stock.getName() != null && stock.getTicker() != null && stock.getBuyPrice() >= 0 && stock.getQuantity() >= 0) {
            return stockRepository.save(stock);
        } else {
            throw new IllegalArgumentException("Stock details are not valid.");
        }
    }
    public Stock updateStock(Long id, Stock stock) {
        Optional<Stock> existingStock = stockRepository.findById(id);
        if (existingStock.isPresent()) {
            Stock updatedStock = existingStock.get();
            updatedStock.setName(stock.getName());
            updatedStock.setTicker(stock.getTicker());
            updatedStock.setBuyPrice(stock.getBuyPrice());
            updatedStock.setQuantity(stock.getQuantity());

            return stockRepository.save(updatedStock);
        } else {
            throw new RuntimeException("Stock not found for ID: " + id);
        }
    }

    // Delete a stock by ID
    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }
    @Transactional
    public void deleteAllStocksAndReset() {
        stockRepository.deleteAll();
        stockRepository.resetAutoIncrement();
    }

    // Additional methods
    public double getPortfolioValue() {
        return 0.0;
    }

    public List<Stock> getTopGainers(int count) {
        return null;
    }

    public List<Stock> getTopLosers(int count) {
        
        return new ArrayList<>();
    }
    public void partialUpdateStock(Long id, Map<String, Object> updates) {
        Stock stock = stockRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Stock not found"));
    
        updates.forEach((key, value) -> {
            Field field = ReflectionUtils.findField(Stock.class, key);
            if (field != null) {
                field.setAccessible(true);
                ReflectionUtils.setField(field, stock, value);
            }
        });
    
        stockRepository.save(stock);  
    }
}