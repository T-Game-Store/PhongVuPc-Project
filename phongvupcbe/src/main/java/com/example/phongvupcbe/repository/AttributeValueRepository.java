package com.example.phongvupcbe.repository;
import com.example.phongvupcbe.model.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AttributeValueRepository extends JpaRepository<AttributeValue, Long> {
    Optional<AttributeValue> findByAttributeIdAndValue(Long attributeId, String value);
}