package com.portfoliopro.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String symbol;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String sector;

    @Column(name = "current_price", nullable = false)
    private BigDecimal currentPrice;

    @Column(name = "previous_price", nullable = false)
    private BigDecimal previousPrice;

    public Stock() {}

    public Stock(Long id, String symbol, String companyName, String sector, BigDecimal currentPrice, BigDecimal previousPrice) {
        this.id = id;
        this.symbol = symbol;
        this.companyName = companyName;
        this.sector = sector;
        this.currentPrice = currentPrice;
        this.previousPrice = previousPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getPreviousPrice() {
        return previousPrice;
    }

    public void setPreviousPrice(BigDecimal previousPrice) {
        this.previousPrice = previousPrice;
    }

    public BigDecimal getDayChange() {
        if (currentPrice == null || previousPrice == null) return BigDecimal.ZERO;
        return currentPrice.subtract(previousPrice);
    }

    public BigDecimal getDayChangePercent() {
        if (previousPrice == null || previousPrice.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        BigDecimal diff = currentPrice.subtract(previousPrice);
        return diff.multiply(new BigDecimal("100")).divide(previousPrice, 2, java.math.RoundingMode.HALF_UP);
    }
}
