package com.spotbook.workspace;

import com.spotbook.booking.BookingRepository;
import com.spotbook.booking.BookingStatus;
import com.spotbook.infrastructure.exception.BadRequestException;
import com.spotbook.infrastructure.exception.ResourceNotFoundException;
import com.spotbook.workspace.dto.CreateWorkspaceRequest;
import com.spotbook.workspace.dto.UpdateWorkspaceRequest;
import com.spotbook.workspace.dto.WorkspaceResponse;
import com.spotbook.workspace.dto.WorkspaceWithAvailability;
import com.spotbook.workspace.mapper.WorkspaceMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final BookingRepository bookingRepository;
    private final WorkspaceMapper workspaceMapper;

    public WorkspaceService(
            WorkspaceRepository workspaceRepository,
            BookingRepository bookingRepository,
            WorkspaceMapper workspaceMapper
    ) {
        this.workspaceRepository = workspaceRepository;
        this.bookingRepository = bookingRepository;
        this.workspaceMapper = workspaceMapper;
    }

    @Transactional(readOnly = true)
    public List<WorkspaceWithAvailability> getWorkspacesWithAvailability(
            Integer floor,
            Instant from,
            Instant to
    ) {
        int targetFloor = floor != null ? floor : 1;
        List<Workspace> workspaces = workspaceRepository.findByFloorAndIsActiveTrueOrderByNameAsc(targetFloor);

        if (from != null && to != null) {
            if (!to.isAfter(from)) {
                throw new BadRequestException("Parameter 'to' must be strictly after 'from'");
            }
            Set<UUID> occupiedIds = bookingRepository.findOccupiedWorkspaceIds(from, to, BookingStatus.CONFIRMED);
            return workspaces.stream()
                    .map(ws -> workspaceMapper.toWithAvailability(ws, !occupiedIds.contains(ws.getId())))
                    .toList();
        }

        return workspaces.stream()
                .map(ws -> workspaceMapper.toWithAvailability(ws, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getAllWorkspaces(Integer floor) {
        List<Workspace> workspaces = floor != null
                ? workspaceRepository.findByFloorOrderByNameAsc(floor)
                : workspaceRepository.findAll();

        return workspaces.stream()
                .map(workspaceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getById(UUID id) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        return workspaceMapper.toResponse(workspace);
    }

    @Transactional
    public WorkspaceResponse create(CreateWorkspaceRequest request) {
        Workspace workspace = workspaceMapper.toEntity(request);
        if (request.isActive() != null) {
            workspace.setIsActive(request.isActive());
        }
        Workspace saved = workspaceRepository.save(workspace);
        return workspaceMapper.toResponse(saved);
    }

    @Transactional
    public WorkspaceResponse update(UUID id, UpdateWorkspaceRequest request) {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));

        workspace.setName(request.name().trim());
        workspace.setType(request.type());
        workspace.setCapacity(request.capacity());
        workspace.setFloor(request.floor());
        workspace.setPosX(request.posX());
        workspace.setPosY(request.posY());
        workspace.setWidth(request.width());
        workspace.setHeight(request.height());
        workspace.setIsActive(request.isActive());

        Workspace updated = workspaceRepository.save(workspace);
        return workspaceMapper.toResponse(updated);
    }

    @Transactional
    public void delete(UUID id) {
        if (!workspaceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workspace not found with id: " + id);
        }
        workspaceRepository.deleteById(id);
    }
}
