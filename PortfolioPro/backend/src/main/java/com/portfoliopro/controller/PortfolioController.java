package com.portfoliopro.controller;

import com.portfoliopro.dto.PortfolioDTOs.PortfolioSummaryDto;
import com.portfoliopro.entity.User;
import com.portfoliopro.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<?> getPortfolioSummary(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        PortfolioSummaryDto summary = portfolioService.getPortfolioSummary(user);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/holdings")
    public ResponseEntity<?> getHoldings(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        PortfolioSummaryDto summary = portfolioService.getPortfolioSummary(user);
        return ResponseEntity.ok(summary.getHoldings());
    }
}
