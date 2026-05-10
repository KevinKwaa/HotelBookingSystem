package com.hotel.booking.service;

import com.hotel.booking.model.Room;
import com.hotel.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> findAvailable(LocalDate checkIn, LocalDate checkOut, Room.Category category) {
        return roomRepository.findAvailableRooms(checkIn, checkOut, category);
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public List<Room> findByCategory(Room.Category category) {
        return roomRepository.findByCategory(category);
    }

    public Room updateStatus(Long roomId, Room.Status status) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));
        room.setStatus(status);
        return roomRepository.save(room);
    }

    public Room deleteRoom(Long roomId) { 
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));
        roomRepository.deleteById(roomId);
        return room;
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }
}