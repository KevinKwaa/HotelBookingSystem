package com.hotel.booking.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.booking.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUserId(Long userId);
    User findByEmail(String email);
    
    boolean existsByEmail(String email);
}