package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.Category;
import com.example.phongvupcbe.model.dto.CategoryRequest;
import com.example.phongvupcbe.repository.CategoryRepository;
import com.example.phongvupcbe.service.AuditLogService;
import com.example.phongvupcbe.service.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public Category createCategory(CategoryRequest request, String actor) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus());
        category.setImageUrl(request.getImageUrl());
        category.setSlug(request.getName().toLowerCase().replaceAll("\\s+", "-"));

        Category savedCategory = categoryRepository.save(category);
        auditLogService.saveLog(actor, "CATEGORY", "CREATE", "đã thêm danh mục: " + savedCategory.getName());

        return savedCategory;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category updateCategory(Long id, CategoryRequest request, String actor) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        if (!category.getName().equals(request.getName())
                && categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setStatus(request.getStatus());
        category.setImageUrl(request.getImageUrl());
        category.setSlug(request.getName().toLowerCase().replaceAll("\\s+", "-"));
        category.setUpdatedAt(LocalDateTime.now());

        Category updatedCategory = categoryRepository.save(category);
        auditLogService.saveLog(actor, "CATEGORY", "UPDATE", "đã cập nhật danh mục: " + updatedCategory.getName());

        return updatedCategory;
    }

    @Override
    public void deleteCategory(Long id, String actor) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục để xóa!"));

        String imageUrl = category.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                String pathStr = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
                Path path = Paths.get(pathStr);
                Files.deleteIfExists(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        categoryRepository.delete(category);
        auditLogService.saveLog(actor, "CATEGORY", "DELETE", "đã xóa danh mục: " + category.getName());
    }
}