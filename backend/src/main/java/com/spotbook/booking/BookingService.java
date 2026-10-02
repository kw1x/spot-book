package com.spotbook.booking;

import com.spotbook.booking.dto.BookingResponse;
import com.spotbook.booking.dto.CreateBookingRequest;
import com.spotbook.booking.mapper.BookingMapper;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.infrastructure.exception.BookingConflictException;
import com.spotbook.infrastructure.exception.ResourceNotFoundException;
import com.spotbook.user.User;
import com.spotbook.user.UserRepository;
import com.spotbook.workspace.Workspace;
import com.spotbook.workspace.WorkspaceRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final Clock clock;

    public BookingService(
            BookingRepository bookingRepository,
            WorkspaceRepository workspaceRepository,
            UserRepository userRepository,
            BookingMapper bookingMapper,
            Clock clock
    ) {
        this.bookingRepository = bookingRepository;
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository;
        this.bookingMapper = bookingMapper;
        this.clock = clock;
    }

    @Transactional
    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new BadRequestException("Booking end time must be strictly after start time");
        }

        if (request.startTime().isBefore(clock.instant().minusSeconds(300))) {
            throw new BadRequestException("Cannot create booking in the past");
        }

        Workspace workspace = workspaceRepository.findById(request.workspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found: " + request.workspaceId()));

        if (!Boolean.TRUE.equals(workspace.getIsActive())) {
            throw new BadRequestException("Workspace is currently inactive and cannot be booked");
        }

        boolean hasConflict = bookingRepository.existsOverlappingBooking(
                workspace.getId(),
                request.startTime(),
                request.endTime(),
                BookingStatus.CONFIRMED
        );

        if (hasConflict) {
            throw new BookingConflictException("Workspace '" + workspace.getName() + "' is already booked for this time interval");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Booking booking = Booking.builder()
                .workspace(workspace)
                .user(user)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, UUID userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return bookingMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(UUID userId) {
        return bookingRepository.findByUserIdWithWorkspace(userId).stream()
                .map(bookingMapper::toResponse)
                .toList();
    }
}
