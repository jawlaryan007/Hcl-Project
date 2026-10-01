package com.portfoliopro.dto;

import java.math.BigDecimal;

public class TradeDTOs {

    public static class TradeRequest {
        private Long stockId;
        private Integer quantity;

        public Long getStockId() { return stockId; }
        public void setStockId(Long stockId) { this.stockId = stockId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class TradeResponse {
        private String message;
        private boolean success;
        private BigDecimal newVirtualBalance;
        private Object transaction;

        public TradeResponse(boolean success, String message, BigDecimal newVirtualBalance, Object transaction) {
            this.success = success;
            this.message = message;
            this.newVirtualBalance = newVirtualBalance;
            this.transaction = transaction;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public BigDecimal getNewVirtualBalance() { return newVirtualBalance; }
        public void setNewVirtualBalance(BigDecimal newVirtualBalance) { this.newVirtualBalance = newVirtualBalance; }
        public Object getTransaction() { return transaction; }
        public void setTransaction(Object transaction) { this.transaction = transaction; }
    }
}
