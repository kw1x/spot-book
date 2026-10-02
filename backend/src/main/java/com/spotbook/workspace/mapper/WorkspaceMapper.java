package com.spotbook.workspace.mapper;

import com.spotbook.workspace.Workspace;
import com.spotbook.workspace.dto.CreateWorkspaceRequest;
import com.spotbook.workspace.dto.WorkspaceResponse;
import com.spotbook.workspace.dto.WorkspaceWithAvailability;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface WorkspaceMapper {

    WorkspaceResponse toResponse(Workspace workspace);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    Workspace toEntity(CreateWorkspaceRequest request);

    @Mapping(target = "isAvailable", source = "isAvailable")
    WorkspaceWithAvailability toWithAvailability(Workspace workspace, boolean isAvailable);
}
