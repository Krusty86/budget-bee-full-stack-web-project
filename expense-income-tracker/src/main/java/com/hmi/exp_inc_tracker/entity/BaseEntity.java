package com.hmi.exp_inc_tracker.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

/*
 * BaseEntity
 *
 * Common fields shared by all entities.
 * Other entities will extend this class.
 */

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {

	// Record creation date/time
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Record last update date/time
    private LocalDateTime updatedAt;

    // Soft delete date/time
    private LocalDateTime deletedAt;

    /*
     * Called automatically before INSERT
     */
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /*
     * Called automatically before UPDATE
     */
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
