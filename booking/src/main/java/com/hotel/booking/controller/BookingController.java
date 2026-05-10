package com.hotel.booking.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/getBookingbyUser/{userId}")
    public ResponseEntity<List<Booking>> getBookingbyUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingByUser(userId));
    }

    @GetMapping("/getBookingbyRoom/{roomId}")
    public ResponseEntity<List<Booking>> getBookingByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(bookingService.getBookingByRoom(roomId));
    }

    @GetMapping("/getBookingbyUserandRoom")
    public ResponseEntity<List<Booking>> getBookingByUserAndRoom(
        @RequestParam (required = false) Long userId, 
        @RequestParam (required = false) Long roomId) {
        return ResponseEntity.ok(bookingService.getBookingByUserAndRoom(userId, roomId));
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