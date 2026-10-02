package com.spotbook.booking;

import com.spotbook.booking.dto.BookingResponse;
import com.spotbook.booking.dto.CreateBookingRequest;
import com.spotbook.booking.mapper.BookingMapper;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.infrastructure.exception.BookingConflictException;
import com.spotbook.user.User;
import com.spotbook.user.UserRole;
import com.spotbook.user.UserRepository;
import com.spotbook.workspace.Workspace;
import com.spotbook.workspace.WorkspaceRepository;
import com.spotbook.workspace.WorkspaceType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookingMapper bookingMapper;

    private Clock clock;
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        clock = Clock.fixed(Instant.parse("2026-10-03T10:00:00Z"), ZoneOffset.UTC);
        bookingService = new BookingService(bookingRepository, workspaceRepository, userRepository, bookingMapper, clock);
    }

    @Test
    void shouldCreateBookingWhenNoConflict() {
        UUID userId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Instant start = Instant.parse("2026-10-03T12:00:00Z");
        Instant end = Instant.parse("2026-10-03T14:00:00Z");

        CreateBookingRequest request = new CreateBookingRequest(workspaceId, start, end);

        Workspace workspace = Workspace.builder()
                .name("Desk A1")
                .type(WorkspaceType.DESK)
                .capacity(1)
                .floor(1)
                .isActive(true)
                .build();
        workspace.setId(workspaceId);

        User user = User.builder()
                .email("user@spotbook.com")
                .fullName("User")
                .role(UserRole.ROLE_USER)
                .build();
        user.setId(userId);

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
        when(bookingRepository.existsOverlappingBooking(workspaceId, start, end, BookingStatus.CONFIRMED)).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Booking savedBooking = Booking.builder()
                .workspace(workspace)
                .user(user)
                .startTime(start)
                .endTime(end)
                .status(BookingStatus.CONFIRMED)
                .build();
        savedBooking.setId(UUID.randomUUID());

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        BookingResponse expectedResponse = new BookingResponse(
                savedBooking.getId(),
                workspaceId,
                "Desk A1",
                WorkspaceType.DESK,
                1,
                start,
                end,
                BookingStatus.CONFIRMED,
                Instant.now()
        );
        when(bookingMapper.toResponse(savedBooking)).thenReturn(expectedResponse);

        BookingResponse response = bookingService.createBooking(userId, request);

        assertThat(response).isNotNull();
        assertThat(response.workspaceName()).isEqualTo("Desk A1");
        assertThat(response.status()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void shouldThrowConflictWhenWorkspaceAlreadyBooked() {
        UUID userId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Instant start = Instant.parse("2026-10-03T12:00:00Z");
        Instant end = Instant.parse("2026-10-03T14:00:00Z");

        CreateBookingRequest request = new CreateBookingRequest(workspaceId, start, end);

        Workspace workspace = Workspace.builder()
                .name("Desk A1")
                .type(WorkspaceType.DESK)
                .isActive(true)
                .build();
        workspace.setId(workspaceId);

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
        when(bookingRepository.existsOverlappingBooking(workspaceId, start, end, BookingStatus.CONFIRMED)).thenReturn(true);

        assertThatThrownBy(() -> bookingService.createBooking(userId, request))
                .isInstanceOf(BookingConflictException.class)
                .hasMessageContaining("already booked");
    }

    @Test
    void shouldThrowWhenEndTimeBeforeStartTime() {
        UUID userId = UUID.randomUUID();
        UUID workspaceId = UUID.randomUUID();
        Instant start = Instant.parse("2026-10-03T14:00:00Z");
        Instant end = Instant.parse("2026-10-03T12:00:00Z");

        CreateBookingRequest request = new CreateBookingRequest(workspaceId, start, end);

        assertThatThrownBy(() -> bookingService.createBooking(userId, request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("end time must be strictly after start time");
    }

    @Test
    void shouldThrowWhenNonOwnerCancelsBooking() {
        UUID bookingId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();
        UUID attackerId = UUID.randomUUID();

        User owner = User.builder().email("owner@spotbook.com").build();
        owner.setId(ownerId);

        Booking booking = Booking.builder().user(owner).status(BookingStatus.CONFIRMED).build();
        booking.setId(bookingId);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> bookingService.cancelBooking(bookingId, attackerId, false))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("not authorized to cancel");
    }
}
