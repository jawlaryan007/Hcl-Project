package com.portfoliopro.config;

import com.portfoliopro.entity.Stock;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.StockRepository;
import com.portfoliopro.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, StockRepository stockRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedStocks();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@portfoliopro.com")) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@portfoliopro.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setVirtualBalance(new BigDecimal("1000000.00"));
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("student@portfoliopro.com")) {
            User student = new User();
            student.setName("Student Trader");
            student.setEmail("student@portfoliopro.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole("USER");
            student.setVirtualBalance(new BigDecimal("100000.00"));
            userRepository.save(student);
        }
    }

    private void seedStocks() {
        if (stockRepository.count() == 0) {
            List<Stock> stocks = Arrays.asList(
                new Stock(null, "RELIANCE", "Reliance Industries Ltd", "Energy & Telecom", new BigDecimal("2500.00"), new BigDecimal("2463.00")),
                new Stock(null, "TCS", "Tata Consultancy Services", "Information Technology", new BigDecimal("3500.00"), new BigDecimal("3472.00")),
                new Stock(null, "INFY", "Infosys Limited", "Information Technology", new BigDecimal("1600.00"), new BigDecimal("1608.00")),
                new Stock(null, "HDFCBANK", "HDFC Bank Limited", "Banking & Finance", new BigDecimal("1550.00"), new BigDecimal("1540.00")),
                new Stock(null, "ICICIBANK", "ICICI Bank Limited", "Banking & Finance", new BigDecimal("980.00"), new BigDecimal("968.00")),
                new Stock(null, "ITC", "ITC Limited", "FMCG", new BigDecimal("440.00"), new BigDecimal("435.00")),
                new Stock(null, "SBIN", "State Bank of India", "Banking & Finance", new BigDecimal("620.00"), new BigDecimal("612.00")),
                new Stock(null, "TATAMOTORS", "Tata Motors Ltd", "Automobile", new BigDecimal("680.00"), new BigDecimal("670.00")),
                new Stock(null, "BHARTIARTL", "Bharti Airtel Limited", "Telecommunications", new BigDecimal("1120.00"), new BigDecimal("1105.00")),
                new Stock(null, "LT", "Larsen & Toubro Ltd", "Engineering & Infra", new BigDecimal("3400.00"), new BigDecimal("3375.00")),
                new Stock(null, "WIPRO", "Wipro Limited", "Information Technology", new BigDecimal("480.00"), new BigDecimal("475.00")),
                new Stock(null, "AXISBANK", "Axis Bank Limited", "Banking & Finance", new BigDecimal("1050.00"), new BigDecimal("1040.00"))
            );
            stockRepository.saveAll(stocks);
        }
    }
}
