package com.hotel.booking.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hotel.booking.model.User;
import com.hotel.booking.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/getUserById")
    public ResponseEntity<List<User>> getUserById(Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @GetMapping("/deleteUser")
    public ResponseEntity<User> deleteUser(Long userId) {
        return ResponseEntity.ok(userService.deleteUser(userId));
    }

    @GetMapping("/addUser")
    public ResponseEntity<User> addUser(User user) {
        return ResponseEntity.ok(userService.addUser(user));
    }
}
