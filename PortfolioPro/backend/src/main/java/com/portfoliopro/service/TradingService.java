package com.portfoliopro.service;

import com.portfoliopro.dto.TradeDTOs.*;
import com.portfoliopro.entity.Holding;
import com.portfoliopro.entity.Stock;
import com.portfoliopro.entity.Transaction;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.HoldingRepository;
import com.portfoliopro.repository.StockRepository;
import com.portfoliopro.repository.TransactionRepository;
import com.portfoliopro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TradingService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final HoldingRepository holdingRepository;
    private final TransactionRepository transactionRepository;

    public TradingService(UserRepository userRepository, StockRepository stockRepository,
                          HoldingRepository holdingRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.holdingRepository = holdingRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TradeResponse buyStock(User user, TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0!");
        }

        Stock stock = stockRepository.findById(request.getStockId())
                .orElseThrow(() -> new RuntimeException("Stock not found!"));

        BigDecimal totalCost = stock.getCurrentPrice().multiply(new BigDecimal(request.getQuantity()));

        User freshUser = userRepository.findById(user.getId()).orElseThrow();
        if (freshUser.getVirtualBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient virtual balance! Required: ₹" + totalCost + ", Available: ₹" + freshUser.getVirtualBalance());
        }

        // Deduct Virtual Balance
        BigDecimal newBalance = freshUser.getVirtualBalance().subtract(totalCost);
        freshUser.setVirtualBalance(newBalance);
        userRepository.save(freshUser);

        // Update or Create Holding
        Optional<Holding> holdingOpt = holdingRepository.findByUserIdAndStockId(freshUser.getId(), stock.getId());
        Holding holding;
        if (holdingOpt.isPresent()) {
            holding = holdingOpt.get();
            int currentQty = holding.getQuantity();
            BigDecimal currentTotalSpent = holding.getAveragePrice().multiply(new BigDecimal(currentQty));
            int newQty = currentQty + request.getQuantity();
            BigDecimal newTotalSpent = currentTotalSpent.add(totalCost);
            BigDecimal newAvgPrice = newTotalSpent.divide(new BigDecimal(newQty), 2, RoundingMode.HALF_UP);

            holding.setQuantity(newQty);
            holding.setAveragePrice(newAvgPrice);
        } else {
            holding = new Holding();
            holding.setUser(freshUser);
            holding.setStock(stock);
            holding.setQuantity(request.getQuantity());
            holding.setAveragePrice(stock.getCurrentPrice());
        }
        holdingRepository.save(holding);

        // Record Transaction
        Transaction tx = new Transaction();
        tx.setUser(freshUser);
        tx.setStock(stock);
        tx.setType("BUY");
        tx.setQuantity(request.getQuantity());
        tx.setPrice(stock.getCurrentPrice());
        tx.setTotalAmount(totalCost);
        tx.setTransactionDate(LocalDateTime.now());
        tx.setStatus("COMPLETED");
        Transaction savedTx = transactionRepository.save(tx);

        return new TradeResponse(true, "Successfully bought " + request.getQuantity() + " shares of " + stock.getSymbol() + " for ₹" + totalCost, newBalance, savedTx);
    }

    @Transactional
    public TradeResponse sellStock(User user, TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0!");
        }

        Stock stock = stockRepository.findById(request.getStockId())
                .orElseThrow(() -> new RuntimeException("Stock not found!"));

        Holding holding = holdingRepository.findByUserIdAndStockId(user.getId(), stock.getId())
                .orElseThrow(() -> new RuntimeException("You do not own any shares of " + stock.getSymbol()));

        if (holding.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient shares! You own " + holding.getQuantity() + " shares of " + stock.getSymbol());
        }

        BigDecimal totalRevenue = stock.getCurrentPrice().multiply(new BigDecimal(request.getQuantity()));

        User freshUser = userRepository.findById(user.getId()).orElseThrow();
        BigDecimal newBalance = freshUser.getVirtualBalance().add(totalRevenue);
        freshUser.setVirtualBalance(newBalance);
        userRepository.save(freshUser);

        // Update Holding
        int remainingQty = holding.getQuantity() - request.getQuantity();
        if (remainingQty == 0) {
            holdingRepository.delete(holding);
        } else {
            holding.setQuantity(remainingQty);
            holdingRepository.save(holding);
        }

        // Record Transaction
        Transaction tx = new Transaction();
        tx.setUser(freshUser);
        tx.setStock(stock);
        tx.setType("SELL");
        tx.setQuantity(request.getQuantity());
        tx.setPrice(stock.getCurrentPrice());
        tx.setTotalAmount(totalRevenue);
        tx.setTransactionDate(LocalDateTime.now());
        tx.setStatus("COMPLETED");
        Transaction savedTx = transactionRepository.save(tx);

        return new TradeResponse(true, "Successfully sold " + request.getQuantity() + " shares of " + stock.getSymbol() + " for ₹" + totalRevenue, newBalance, savedTx);
    }
}
