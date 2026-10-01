package com.portfoliopro.service;

import com.portfoliopro.config.JwtUtils;
import com.portfoliopro.dto.AuthDTOs.*;
import com.portfoliopro.entity.User;
import com.portfoliopro.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        String role = (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";
        user.setRole(role);
        user.setVirtualBalance(new BigDecimal("100000.00"));

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getId());
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getVirtualBalance());

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole(), user.getId());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getVirtualBalance());

        return new AuthResponse(token, userDto);
    }

    public UserDto getCurrentUserDto(User user) {
        // Refresh from DB
        User updated = userRepository.findById(user.getId()).orElse(user);
        return new UserDto(updated.getId(), updated.getName(), updated.getEmail(), updated.getRole(), updated.getVirtualBalance());
    }
}
