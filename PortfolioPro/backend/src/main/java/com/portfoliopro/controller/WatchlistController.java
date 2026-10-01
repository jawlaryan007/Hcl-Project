package com.portfoliopro.controller;

import com.portfoliopro.entity.User;
import com.portfoliopro.entity.Watchlist;
import com.portfoliopro.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<?> getWatchlist(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        List<Watchlist> watchlist = watchlistService.getUserWatchlist(user);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/{stockId}")
    public ResponseEntity<?> addToWatchlist(@AuthenticationPrincipal User user, @PathVariable Long stockId) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            Watchlist item = watchlistService.addToWatchlist(user, stockId);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{stockId}")
    public ResponseEntity<?> removeFromWatchlist(@AuthenticationPrincipal User user, @PathVariable Long stockId) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            watchlistService.removeFromWatchlist(user, stockId);
            return ResponseEntity.ok(Map.of("message", "Removed from watchlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/check/{stockId}")
    public ResponseEntity<?> checkWatchlist(@AuthenticationPrincipal User user, @PathVariable Long stockId) {
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        boolean exists = watchlistService.isInWatchlist(user, stockId);
        return ResponseEntity.ok(Map.of("inWatchlist", exists));
    }
}
