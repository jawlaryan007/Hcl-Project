package com.portfoliopro.service;

import com.portfoliopro.entity.Transaction;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getUserTransactions(User user) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(user.getId());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc();
    }
}
