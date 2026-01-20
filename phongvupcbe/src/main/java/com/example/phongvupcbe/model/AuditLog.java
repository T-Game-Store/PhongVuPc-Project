package com.example.phongvupcbe.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String username;
    private String module;
    private String action;
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String dataAfter;
    private LocalDateTime createdAt = LocalDateTime.now();
}