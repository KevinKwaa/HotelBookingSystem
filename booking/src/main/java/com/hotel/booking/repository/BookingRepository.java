package com.hotel.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.booking.model.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoomId(Long roomId);
    List<Booking> findByUserUserId(Long userId);
    List<Booking> findByUserUserIdAndRoomId(Long userId, Long roomId);
}