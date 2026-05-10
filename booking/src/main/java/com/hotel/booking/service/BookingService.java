package com.hotel.booking.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.hotel.booking.model.Booking;
import com.hotel.booking.model.Room;
import com.hotel.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final RoomService roomService;
    private final BookingRepository bookingRepository;

    public List<Booking> getBookingByUser(Long id){
        return bookingRepository.findByUserId(id);
    }

    public List<Booking> getBookingByRoom(Long roomId){
        return bookingRepository.findByRoomId(roomId);
    }

    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    public Booking deleteBooking(Long bookingId, Long roomId){
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Room not found"));
        roomService.updateStatus(roomId, Room.Status.Available);
        bookingRepository.deleteById(bookingId);
        return booking;
    }

    public Booking addBooking(Booking booking){
        roomService.updateStatus(booking.getRoom().getId(), Room.Status.Booked);
        bookingRepository.save(booking);
        return booking;
    }
}