package com.spotbook.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    @Query("SELECT b.workspace.id FROM Booking b WHERE b.status = :status AND b.startTime < :endTime AND b.endTime > :startTime")
    Set<UUID> findOccupiedWorkspaceIds(
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("status") BookingStatus status
    );

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.workspace.id = :workspaceId AND b.status = :status AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
            @Param("workspaceId") UUID workspaceId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("status") BookingStatus status
    );

    @Query("SELECT b FROM Booking b JOIN FETCH b.workspace WHERE b.user.id = :userId ORDER BY b.startTime DESC")
    List<Booking> findByUserIdWithWorkspace(@Param("userId") UUID userId);

    Optional<Booking> findByIdAndUserId(UUID id, UUID userId);
}
