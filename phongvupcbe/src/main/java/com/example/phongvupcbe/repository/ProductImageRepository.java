package com.example.phongvupcbe.repository;
import com.example.phongvupcbe.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {}