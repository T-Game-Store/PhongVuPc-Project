package com.example.phongvupcbe.service;

import com.example.phongvupcbe.model.Category;
import com.example.phongvupcbe.model.dto.CategoryRequest;
import java.util.List;

public interface CategoryService {
    Category createCategory(CategoryRequest request, String actor);
    List<Category> getAllCategories();
    Category updateCategory(Long id, CategoryRequest request, String actor);
    void deleteCategory(Long id, String actor);
}