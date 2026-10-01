package com.portfoliopro.controller;

import com.portfoliopro.dto.TradeDTOs.*;
import com.portfoliopro.entity.User;
import com.portfoliopro.service.TradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trading")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyStock(@AuthenticationPrincipal User user, @RequestBody TradeRequest request) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            TradeResponse response = tradingService.buyStock(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(@AuthenticationPrincipal User user, @RequestBody TradeRequest request) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            TradeResponse response = tradingService.sellStock(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage(), "success", false));
        }
    }
}
