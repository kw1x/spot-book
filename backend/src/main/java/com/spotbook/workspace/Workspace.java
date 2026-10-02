package com.spotbook.workspace;

import com.spotbook.infrastructure.persistence.BaseUuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "workspaces")
public class Workspace extends BaseUuidEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private WorkspaceType type;

    @Column(name = "capacity", nullable = false)
    private Integer capacity = 1;

    @Column(name = "floor", nullable = false)
    private Integer floor = 1;

    @Column(name = "pos_x", nullable = false)
    private Integer posX = 0;

    @Column(name = "pos_y", nullable = false)
    private Integer posY = 0;

    @Column(name = "width", nullable = false)
    private Integer width = 60;

    @Column(name = "height", nullable = false)
    private Integer height = 40;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Workspace() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WorkspaceType getType() {
        return type;
    }

    public void setType(WorkspaceType type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public Integer getPosX() {
        return posX;
    }

    public void setPosX(Integer posX) {
        this.posX = posX;
    }

    public Integer getPosY() {
        return posY;
    }

    public void setPosY(Integer posY) {
        this.posY = posY;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String name;
        private WorkspaceType type;
        private Integer capacity = 1;
        private Integer floor = 1;
        private Integer posX = 0;
        private Integer posY = 0;
        private Integer width = 60;
        private Integer height = 40;
        private Boolean isActive = true;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder type(WorkspaceType type) {
            this.type = type;
            return this;
        }

        public Builder capacity(Integer capacity) {
            this.capacity = capacity;
            return this;
        }

        public Builder floor(Integer floor) {
            this.floor = floor;
            return this;
        }

        public Builder posX(Integer posX) {
            this.posX = posX;
            return this;
        }

        public Builder posY(Integer posY) {
            this.posY = posY;
            return this;
        }

        public Builder width(Integer width) {
            this.width = width;
            return this;
        }

        public Builder height(Integer height) {
            this.height = height;
            return this;
        }

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public Workspace build() {
            Workspace workspace = new Workspace();
            workspace.setName(this.name);
            workspace.setType(this.type);
            workspace.setCapacity(this.capacity);
            workspace.setFloor(this.floor);
            workspace.setPosX(this.posX);
            workspace.setPosY(this.posY);
            workspace.setWidth(this.width);
            workspace.setHeight(this.height);
            workspace.setIsActive(this.isActive);
            return workspace;
        }
    }
}
