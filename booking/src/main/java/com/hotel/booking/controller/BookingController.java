package com.hotel.booking.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hotel.booking.model.Booking;
import com.hotel.booking.service.BookingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.findAll());
    }

    @GetMapping("/getBookingbyUser")
    public ResponseEntity<List<Booking>> getBookingbyUser(Long id) {
        return ResponseEntity.ok(bookingService.getBookingByUser(id));
    }

    @GetMapping("/getBookingbyRoom")
    public ResponseEntity<List<Booking>> getBookingByRoom(Long roomId) {
        return ResponseEntity.ok(bookingService.getBookingByRoom(roomId));
    }

    @GetMapping("/deleteBooking")
    public ResponseEntity<Booking> deleteBooking(Long bookingId, Long roomId) {
        return ResponseEntity.ok(bookingService.deleteBooking(bookingId, roomId));
    }

    @GetMapping("/addBooking")
    public ResponseEntity<Booking> addBooking(Booking booking) {
        return ResponseEntity.ok(bookingService.addBooking(booking));
    }
}