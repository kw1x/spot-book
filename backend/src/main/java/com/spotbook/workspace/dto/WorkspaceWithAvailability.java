package com.spotbook.workspace.dto;

import com.spotbook.workspace.WorkspaceType;

import java.util.UUID;

public record WorkspaceWithAvailability(
        UUID id,
        String name,
        WorkspaceType type,
        Integer capacity,
        Integer floor,
        Integer posX,
        Integer posY,
        Integer width,
        Integer height,
        Boolean isActive,
        Boolean isAvailable
) {}
