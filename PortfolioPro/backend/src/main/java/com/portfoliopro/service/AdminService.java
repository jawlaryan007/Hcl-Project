package com.portfoliopro.service;

import com.portfoliopro.dto.AdminDTOs.AdminStatsDto;
import com.portfoliopro.entity.Transaction;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.StockRepository;
import com.portfoliopro.repository.TransactionRepository;
import com.portfoliopro.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(UserRepository userRepository, StockRepository stockRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
    }

    public AdminStatsDto getAdminStats() {
        long totalUsers = userRepository.count();
        long totalStocks = stockRepository.count();
        List<Transaction> transactions = transactionRepository.findAll();
        long totalTransactions = transactions.size();

        BigDecimal totalVolume = transactions.stream()
                .map(Transaction::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminStatsDto(totalUsers, totalStocks, totalTransactions, totalVolume);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
