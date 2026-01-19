package com.example.phongvupcbe.service;

import com.example.phongvupcbe.model.Category;
import com.example.phongvupcbe.model.dto.CategoryRequest;

import java.util.List;

public interface CategoryService {
    Category createCategory(CategoryRequest request);
    List<Category> getAllCategories();
    Category updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}