package com.portfoliopro.service;

import com.portfoliopro.dto.PortfolioDTOs.*;
import com.portfoliopro.entity.Holding;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.HoldingRepository;
import com.portfoliopro.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {

    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;

    public PortfolioService(HoldingRepository holdingRepository, UserRepository userRepository) {
        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
    }

    public PortfolioSummaryDto getPortfolioSummary(User user) {
        User freshUser = userRepository.findById(user.getId()).orElse(user);
        List<Holding> userHoldings = holdingRepository.findByUserId(freshUser.getId());

        List<HoldingDto> holdingDtos = new ArrayList<>();
        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal currentPortfolioValue = BigDecimal.ZERO;

        for (Holding h : userHoldings) {
            BigDecimal currentPrice = h.getStock().getCurrentPrice();
            BigDecimal invested = h.getAveragePrice().multiply(new BigDecimal(h.getQuantity()));
            BigDecimal currentVal = currentPrice.multiply(new BigDecimal(h.getQuantity()));
            BigDecimal pl = currentVal.subtract(invested);

            BigDecimal plPct = BigDecimal.ZERO;
            if (invested.compareTo(BigDecimal.ZERO) > 0) {
                plPct = pl.multiply(new BigDecimal("100")).divide(invested, 2, RoundingMode.HALF_UP);
            }

            totalInvested = totalInvested.add(invested);
            currentPortfolioValue = currentPortfolioValue.add(currentVal);

            HoldingDto dto = new HoldingDto(
                    h.getId(),
                    h.getStock(),
                    h.getQuantity(),
                    h.getAveragePrice(),
                    currentPrice,
                    invested,
                    currentVal,
                    pl,
                    plPct
            );
            holdingDtos.add(dto);
        }

        BigDecimal totalPl = currentPortfolioValue.subtract(totalInvested);
        BigDecimal totalPlPct = BigDecimal.ZERO;
        if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
            totalPlPct = totalPl.multiply(new BigDecimal("100")).divide(totalInvested, 2, RoundingMode.HALF_UP);
        }

        BigDecimal availableBalance = freshUser.getVirtualBalance();
        BigDecimal totalValue = availableBalance.add(currentPortfolioValue);

        PortfolioSummaryDto summary = new PortfolioSummaryDto();
        summary.setAvailableBalance(availableBalance);
        summary.setTotalInvested(totalInvested);
        summary.setCurrentPortfolioValue(currentPortfolioValue);
        summary.setTotalValue(totalValue);
        summary.setTotalProfitLoss(totalPl);
        summary.setTotalProfitLossPercentage(totalPlPct);
        summary.setTotalHoldingsCount(userHoldings.size());
        summary.setHoldings(holdingDtos);

        return summary;
    }
}
