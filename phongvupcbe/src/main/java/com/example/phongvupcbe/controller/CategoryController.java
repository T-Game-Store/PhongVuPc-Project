package com.example.phongvupcbe.controller;

import com.example.phongvupcbe.model.Category;
import com.example.phongvupcbe.model.dto.CategoryRequest;
import com.example.phongvupcbe.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Đường dẫn lưu ảnh danh mục
    private final String UPLOAD_DIR = "uploads/categories/";

    // 1. Lấy danh sách danh mục
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // 2. API Upload ảnh (Frontend category.js cần cái này để Preview)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File không được để trống");
            }

            // Tạo thư mục nếu chưa có
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) return ResponseEntity.internalServerError().body("Không thể tạo thư mục lưu trữ");
            }

            // Tạo tên file duy nhất (Time + OriginalName)
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);

            // Lưu file
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn để FE lưu vào DB
            String fileUrl = "/" + UPLOAD_DIR + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Lỗi upload: " + e.getMessage());
        }
    }

    // 3. Tạo danh mục mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CategoryRequest request,
                                    @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        try {
            // Lưu ý: Nếu Service của m chưa có tham số 'actor', hãy cập nhật Service hoặc xóa 'actor' ở đây
            return ResponseEntity.ok(categoryService.createCategory(request, actor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Cập nhật danh mục
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody CategoryRequest request,
                                    @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        try {
            return ResponseEntity.ok(categoryService.updateCategory(id, request, actor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        try {
            categoryService.deleteCategory(id, actor);
            return ResponseEntity.ok("Xóa danh mục thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}