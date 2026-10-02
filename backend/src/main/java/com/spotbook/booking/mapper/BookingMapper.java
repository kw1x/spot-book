package com.spotbook.booking.mapper;

import com.spotbook.booking.Booking;
import com.spotbook.booking.dto.BookingResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookingMapper {

    @Mapping(target = "workspaceId", source = "workspace.id")
    @Mapping(target = "workspaceName", source = "workspace.name")
    @Mapping(target = "workspaceType", source = "workspace.type")
    @Mapping(target = "floor", source = "workspace.floor")
    BookingResponse toResponse(Booking booking);
}
