package com.spotbook.workspace;

import com.spotbook.booking.BookingRepository;
import com.spotbook.booking.BookingStatus;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.workspace.dto.WorkspaceWithAvailability;
import com.spotbook.workspace.mapper.WorkspaceMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WorkspaceServiceTest {

    @Mock
    private WorkspaceRepository workspaceRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private WorkspaceMapper workspaceMapper;

    private WorkspaceService workspaceService;

    @BeforeEach
    void setUp() {
        workspaceService = new WorkspaceService(workspaceRepository, bookingRepository, workspaceMapper);
    }

    @Test
    void shouldCalculateAvailabilityCorrectly() {
        UUID ws1Id = UUID.randomUUID();
        UUID ws2Id = UUID.randomUUID();

        Workspace ws1 = Workspace.builder().name("Desk 1").type(WorkspaceType.DESK).floor(1).isActive(true).build();
        ws1.setId(ws1Id);
        Workspace ws2 = Workspace.builder().name("Desk 2").type(WorkspaceType.DESK).floor(1).isActive(true).build();
        ws2.setId(ws2Id);

        Instant from = Instant.parse("2026-10-03T10:00:00Z");
        Instant to = Instant.parse("2026-10-03T12:00:00Z");

        when(workspaceRepository.findByFloorAndIsActiveTrueOrderByNameAsc(1)).thenReturn(List.of(ws1, ws2));
        when(bookingRepository.findOccupiedWorkspaceIds(from, to, BookingStatus.CONFIRMED)).thenReturn(Set.of(ws1Id));

        WorkspaceWithAvailability res1 = new WorkspaceWithAvailability(ws1Id, "Desk 1", WorkspaceType.DESK, 1, 1, 0, 0, 60, 40, true, false);
        WorkspaceWithAvailability res2 = new WorkspaceWithAvailability(ws2Id, "Desk 2", WorkspaceType.DESK, 1, 1, 100, 0, 60, 40, true, true);

        when(workspaceMapper.toWithAvailability(ws1, false)).thenReturn(res1);
        when(workspaceMapper.toWithAvailability(ws2, true)).thenReturn(res2);

        List<WorkspaceWithAvailability> result = workspaceService.getWorkspacesWithAvailability(1, from, to);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).isAvailable()).isFalse();
        assertThat(result.get(1).isAvailable()).isTrue();
    }

    @Test
    void shouldThrowWhenToBeforeFrom() {
        Instant from = Instant.parse("2026-10-03T12:00:00Z");
        Instant to = Instant.parse("2026-10-03T10:00:00Z");

        assertThatThrownBy(() -> workspaceService.getWorkspacesWithAvailability(1, from, to))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("strictly after");
    }
}
