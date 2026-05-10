package com.hotel.booking.controller;

import com.hotel.booking.model.Room;
import com.hotel.booking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailable(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
        @RequestParam(required = false) Room.Category category
    ) {
        return ResponseEntity.ok(roomService.findAvailable(checkIn, checkOut, category));
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAll() {
        return ResponseEntity.ok(roomService.findAll());
    }

    @GetMapping("/deleteRoom")
    public ResponseEntity<Room> removeRoom(Long roomId){ 
        return ResponseEntity.ok(roomService.deleteRoom(roomId));
    }

    @GetMapping("/newRoom")
    public ResponseEntity<Room> addRoom(@RequestBody Room room){
            return ResponseEntity.ok(roomService.addRoom(room));
    }
}