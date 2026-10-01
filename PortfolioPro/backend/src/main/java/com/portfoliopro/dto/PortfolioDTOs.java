package com.portfoliopro.dto;

import com.portfoliopro.entity.Stock;
import java.math.BigDecimal;
import java.util.List;

public class PortfolioDTOs {

    public static class HoldingDto {
        private Long id;
        private Stock stock;
        private Integer quantity;
        private BigDecimal averagePrice;
        private BigDecimal currentPrice;
        private BigDecimal investedValue;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercentage;

        public HoldingDto() {}

        public HoldingDto(Long id, Stock stock, Integer quantity, BigDecimal averagePrice, BigDecimal currentPrice, BigDecimal investedValue, BigDecimal currentValue, BigDecimal profitLoss, BigDecimal profitLossPercentage) {
            this.id = id;
            this.stock = stock;
            this.quantity = quantity;
            this.averagePrice = averagePrice;
            this.currentPrice = currentPrice;
            this.investedValue = investedValue;
            this.currentValue = currentValue;
            this.profitLoss = profitLoss;
            this.profitLossPercentage = profitLossPercentage;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Stock getStock() { return stock; }
        public void setStock(Stock stock) { this.stock = stock; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getAveragePrice() { return averagePrice; }
        public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
        public BigDecimal getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
        public BigDecimal getInvestedValue() { return investedValue; }
        public void setInvestedValue(BigDecimal investedValue) { this.investedValue = investedValue; }
        public BigDecimal getCurrentValue() { return currentValue; }
        public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }
        public BigDecimal getProfitLoss() { return profitLoss; }
        public void setProfitLoss(BigDecimal profitLoss) { this.profitLoss = profitLoss; }
        public BigDecimal getProfitLossPercentage() { return profitLossPercentage; }
        public void setProfitLossPercentage(BigDecimal profitLossPercentage) { this.profitLossPercentage = profitLossPercentage; }
    }

    public static class PortfolioSummaryDto {
        private BigDecimal availableBalance;
        private BigDecimal totalInvested;
        private BigDecimal currentPortfolioValue;
        private BigDecimal totalValue; // Available Balance + Current Portfolio Value
        private BigDecimal totalProfitLoss;
        private BigDecimal totalProfitLossPercentage;
        private Integer totalHoldingsCount;
        private List<HoldingDto> holdings;

        public PortfolioSummaryDto() {}

        public BigDecimal getAvailableBalance() { return availableBalance; }
        public void setAvailableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; }
        public BigDecimal getTotalInvested() { return totalInvested; }
        public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
        public BigDecimal getCurrentPortfolioValue() { return currentPortfolioValue; }
        public void setCurrentPortfolioValue(BigDecimal currentPortfolioValue) { this.currentPortfolioValue = currentPortfolioValue; }
        public BigDecimal getTotalValue() { return totalValue; }
        public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
        public BigDecimal getTotalProfitLoss() { return totalProfitLoss; }
        public void setTotalProfitLoss(BigDecimal totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }
        public BigDecimal getTotalProfitLossPercentage() { return totalProfitLossPercentage; }
        public void setTotalProfitLossPercentage(BigDecimal totalProfitLossPercentage) { this.totalProfitLossPercentage = totalProfitLossPercentage; }
        public Integer getTotalHoldingsCount() { return totalHoldingsCount; }
        public void setTotalHoldingsCount(Integer totalHoldingsCount) { this.totalHoldingsCount = totalHoldingsCount; }
        public List<HoldingDto> getHoldings() { return holdings; }
        public void setHoldings(List<HoldingDto> holdings) { this.holdings = holdings; }
    }
}
