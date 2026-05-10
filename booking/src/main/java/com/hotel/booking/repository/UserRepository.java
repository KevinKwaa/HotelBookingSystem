package com.hotel.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.hotel.booking.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserId(Long userId);
    User findByEmail(String email);
    
    boolean existsByEmail(String email);

    @Query("""
        SELECT COUNT(*) FROM User 
        WHERE role != 'STAFF'
    """)
    Long countCustomers();
}