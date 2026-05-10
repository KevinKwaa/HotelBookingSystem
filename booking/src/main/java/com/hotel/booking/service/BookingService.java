package com.hotel.booking.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.hotel.booking.dto.BookingRequest;
import com.hotel.booking.model.Booking;
import com.hotel.booking.model.Room;
import com.hotel.booking.model.User;
import com.hotel.booking.repository.BookingRepository;
import com.hotel.booking.repository.RoomRepository;
import com.hotel.booking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final RoomService roomService;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public List<Booking> getBookingByUser(Long id){
        return bookingRepository.findByUserUserId(id);
    }

    public List<Booking> getBookingByRoom(Long roomId){
        return bookingRepository.findByRoomId(roomId);
    }

    public List<Booking> getBookingByUserAndRoom(Long userId, Long roomId){
        return bookingRepository.findByUserUserIdAndRoomId(userId, roomId);
    }

    public Long countBooking(){
        return bookingRepository.count();
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

    public Booking addBooking(BookingRequest request){
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));
        Booking booking = new Booking();
        roomService.updateStatus(request.getRoomId(), Room.Status.Booked);
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setBookingStatus(Booking.Status.valueOf(                    
            request.getBookingStatus().toUpperCase()
        ));
        booking.setTotalPrice(request.getTotalPrice());
        return bookingRepository.save(booking);
    }
}