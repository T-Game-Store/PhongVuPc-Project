package com.example.phongvupcbe.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactName;
    private String email;
    private String phone;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(length = 20)
    private String status = "active";

    private LocalDateTime createdAt = LocalDateTime.now();
}