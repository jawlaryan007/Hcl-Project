package com.portfoliopro.service;

import com.portfoliopro.entity.Stock;
import com.portfoliopro.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    public Stock getStockById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
    }

    public List<Stock> searchStocks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStocks();
        }
        return stockRepository.searchStocks(query.trim());
    }

    public Stock createStock(Stock stock) {
        if (stockRepository.existsBySymbol(stock.getSymbol())) {
            throw new RuntimeException("Stock with symbol " + stock.getSymbol() + " already exists!");
        }
        return stockRepository.save(stock);
    }

    public Stock updateStock(Long id, Stock updatedStock) {
        Stock stock = getStockById(id);
        stock.setCompanyName(updatedStock.getCompanyName());
        stock.setSector(updatedStock.getSector());
        if (updatedStock.getCurrentPrice() != null) {
            stock.setPreviousPrice(stock.getCurrentPrice());
            stock.setCurrentPrice(updatedStock.getCurrentPrice());
        }
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        Stock stock = getStockById(id);
        stockRepository.delete(stock);
    }
}
