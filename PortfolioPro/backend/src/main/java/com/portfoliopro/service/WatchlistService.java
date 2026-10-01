package com.portfoliopro.service;

import com.portfoliopro.entity.Stock;
import com.portfoliopro.entity.User;
import com.portfoliopro.entity.Watchlist;
import com.portfoliopro.repository.StockRepository;
import com.portfoliopro.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final StockRepository stockRepository;

    public WatchlistService(WatchlistRepository watchlistRepository, StockRepository stockRepository) {
        this.watchlistRepository = watchlistRepository;
        this.stockRepository = stockRepository;
    }

    public List<Watchlist> getUserWatchlist(User user) {
        return watchlistRepository.findByUserId(user.getId());
    }

    public Watchlist addToWatchlist(User user, Long stockId) {
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + stockId));

        if (watchlistRepository.existsByUserIdAndStockId(user.getId(), stockId)) {
            throw new RuntimeException("Stock is already in your watchlist!");
        }

        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);
        watchlist.setStock(stock);

        return watchlistRepository.save(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(User user, Long stockId) {
        watchlistRepository.deleteByUserIdAndStockId(user.getId(), stockId);
    }

    public boolean isInWatchlist(User user, Long stockId) {
        return watchlistRepository.existsByUserIdAndStockId(user.getId(), stockId);
    }
}
