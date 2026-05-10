package com.hotel.booking.service;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import com.hotel.booking.dto.AuthResponse;
import com.hotel.booking.dto.LoginRequest;
import com.hotel.booking.dto.RegisterRequest;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(request.getPassword());
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);
        return new AuthResponse(
            user.getUserId(),
            user.getName(), 
            user.getEmail(), 
            user.getPhoneNumber(),
            user.getRole().name(),
            user.getCreatedAt(),
            user.getLoyaltyPoint()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());

        if(ObjectUtils.isEmpty(user)){
            throw new RuntimeException("Invalid credentials");
        } else {
            if(!request.getPassword().equals(user.getPassword())){
                throw new RuntimeException("Invalid credentials");
            }
        }
        return new AuthResponse(
            user.getUserId(),
            user.getName(), 
            user.getEmail(), 
            user.getPhoneNumber(),
            user.getRole().name(),
            user.getCreatedAt(),
            user.getLoyaltyPoint()
        );
    }
}
