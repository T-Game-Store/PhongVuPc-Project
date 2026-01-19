package com.example.phongvupcbe.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    private String description;

    @Pattern(regexp = "^(active|inactive)$", message = "Trạng thái phải là active hoặc inactive")
    private String status;
    private String imageUrl;
}