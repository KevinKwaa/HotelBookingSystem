package com.hotel.booking.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getUserById(Long userId){
        return userRepository.findByUserId(userId);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User deleteUser(Long userId){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Room not found"));
        userRepository.deleteById(userId);
        return user;
    }

    public User addUser(User user){
        userRepository.save(user);
        return user;
    }
}