package com.example.phongvupcbe.repository;

import com.example.phongvupcbe.model.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AttributeRepository extends JpaRepository<Attribute, Long> {
    Optional<Attribute> findByName(String name);
    Optional<Attribute> findByCode(String code);
}