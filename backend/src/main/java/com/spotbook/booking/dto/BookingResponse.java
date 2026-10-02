package com.spotbook.booking.dto;

import com.spotbook.booking.BookingStatus;
import com.spotbook.workspace.WorkspaceType;

import java.time.Instant;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID workspaceId,
        String workspaceName,
        WorkspaceType workspaceType,
        Integer floor,
        Instant startTime,
        Instant endTime,
        BookingStatus status,
        Instant createdAt
) {}
