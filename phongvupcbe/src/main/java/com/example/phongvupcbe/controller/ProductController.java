package com.example.phongvupcbe.controller;

import com.example.phongvupcbe.model.Product;
import com.example.phongvupcbe.service.impl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired private ProductServiceImpl productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.getAllProducts(PageRequest.of(page, size)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("data") String productDataJson,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "gallery", required = false) List<MultipartFile> gallery,
            @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        try {
            return ResponseEntity.ok(productService.createProductWithVariants(productDataJson, thumbnail, gallery, actor));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestParam("data") String productDataJson,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestParam(value = "gallery", required = false) List<MultipartFile> gallery,
            @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        try {
            return ResponseEntity.ok(productService.updateProductWithVariants(id, productDataJson, thumbnail, gallery, actor));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        productService.deleteProduct(id, actor);
        return ResponseEntity.ok("Đã xóa thành công");
    }
}