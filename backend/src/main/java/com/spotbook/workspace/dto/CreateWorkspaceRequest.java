package com.spotbook.workspace.dto;

import com.spotbook.workspace.WorkspaceType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateWorkspaceRequest(
        @NotBlank(message = "Workspace name is required")
        @Size(max = 255, message = "Name must not exceed 255 characters")
        String name,

        @NotNull(message = "Workspace type is required")
        WorkspaceType type,

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        @Max(value = 100, message = "Capacity must not exceed 100")
        Integer capacity,

        @NotNull(message = "Floor is required")
        @Min(value = 1, message = "Floor must be at least 1")
        Integer floor,

        @NotNull(message = "pos_x is required")
        @Min(value = 0, message = "pos_x must be non-negative")
        @Max(value = 2000, message = "pos_x must not exceed 2000")
        Integer posX,

        @NotNull(message = "pos_y is required")
        @Min(value = 0, message = "pos_y must be non-negative")
        @Max(value = 2000, message = "pos_y must not exceed 2000")
        Integer posY,

        @NotNull(message = "width is required")
        @Min(value = 10, message = "width must be at least 10")
        @Max(value = 1000, message = "width must not exceed 1000")
        Integer width,

        @NotNull(message = "height is required")
        @Min(value = 10, message = "height must be at least 10")
        @Max(value = 1000, message = "height must not exceed 1000")
        Integer height,

        Boolean isActive
) {}
