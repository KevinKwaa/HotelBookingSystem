package com.hotel.booking.repository;

import com.hotel.booking.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByCategory(Room.Category category);

    // Find rooms NOT booked during the requested date range
    @Query("""
        SELECT r FROM rooms r
        WHERE (:category IS NULL OR r.category = :category)
        AND r.status = 'AVAILABLE'
        AND r.id NOT IN (
            SELECT b.room.id FROM bookings b
            WHERE b.status != 'CANCELLED'
            AND b.checkIn < :checkOut
            AND b.checkOut > :checkIn
        )
    """)
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("category") Room.Category category
    );
}