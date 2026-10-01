package com.portfoliopro.dto;

import java.math.BigDecimal;

public class AdminDTOs {

    public static class AdminStatsDto {
        private long totalUsers;
        private long totalStocks;
        private long totalTransactions;
        private BigDecimal totalPlatformVolume;

        public AdminStatsDto(long totalUsers, long totalStocks, long totalTransactions, BigDecimal totalPlatformVolume) {
            this.totalUsers = totalUsers;
            this.totalStocks = totalStocks;
            this.totalTransactions = totalTransactions;
            this.totalPlatformVolume = totalPlatformVolume;
        }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getTotalStocks() { return totalStocks; }
        public void setTotalStocks(long totalStocks) { this.totalStocks = totalStocks; }
        public long getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }
        public BigDecimal getTotalPlatformVolume() { return totalPlatformVolume; }
        public void setTotalPlatformVolume(BigDecimal totalPlatformVolume) { this.totalPlatformVolume = totalPlatformVolume; }
    }
}
