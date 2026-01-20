package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.*;
import com.example.phongvupcbe.model.dto.ProductCreateRequest;
import com.example.phongvupcbe.repository.*;
import com.example.phongvupcbe.service.AuditLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProductServiceImpl {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductImageRepository productImageRepository;
    @Autowired private ProductVariantRepository productVariantRepository;
    @Autowired private AttributeRepository attributeRepository;
    @Autowired private AttributeValueRepository attributeValueRepository;
    @Autowired private AuditLogService auditLogService;
    @Autowired private ObjectMapper objectMapper;

    private final String UPLOAD_DIR = "uploads/products/";

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Product createProductWithVariants(String productDataJson, MultipartFile thumbnail, List<MultipartFile> gallery, String actor) throws IOException {
        ProductCreateRequest request = objectMapper.readValue(productDataJson, ProductCreateRequest.class);

        if (productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("SKU sản phẩm '" + request.getSku() + "' đã tồn tại!");
        }

        validateVariantSkus(request.getVariants());

        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setSlug(request.getName().toLowerCase().replaceAll("\\s+", "-"));
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus());
        product.setIsNew(request.getIsNew());
        product.setIsBestSeller(request.getIsBestSeller());

        if (request.getCategoryIds() != null) {
            product.setCategories(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            product.setThumbnailUrl(saveFile(thumbnail));
        }

        Product savedProduct = productRepository.save(product);

        if (gallery != null) {
            for (MultipartFile file : gallery) {
                ProductImage img = new ProductImage();
                img.setProduct(savedProduct);
                img.setImageUrl(saveFile(file));
                productImageRepository.save(img);
            }
        }

        if (request.getVariants() != null) {
            saveVariants(savedProduct, request.getVariants());
        }

        auditLogService.saveLog(actor, "PRODUCT", "CREATE", "đã thêm sản phẩm: " + request.getName());
        return savedProduct;
    }

    @Transactional
    public Product updateProductWithVariants(Long id, String productDataJson, MultipartFile thumbnail, List<MultipartFile> gallery, String actor) throws IOException {
        ProductCreateRequest request = objectMapper.readValue(productDataJson, ProductCreateRequest.class);

        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        if (!product.getSku().equals(request.getSku()) && productRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("SKU '" + request.getSku() + "' đã tồn tại!");
        }

        validateVariantSkus(request.getVariants());

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setSlug(request.getName().toLowerCase().replaceAll("\\s+", "-"));
        product.setDescription(request.getDescription());
        product.setStatus(request.getStatus());
        product.setIsNew(request.getIsNew());
        product.setIsBestSeller(request.getIsBestSeller());
        product.setUpdatedAt(LocalDateTime.now());

        if (request.getCategoryIds() != null) {
            product.setCategories(new HashSet<>(categoryRepository.findAllById(request.getCategoryIds())));
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            deleteFile(product.getThumbnailUrl());
            product.setThumbnailUrl(saveFile(thumbnail));
        }

        if (gallery != null && !gallery.isEmpty()) {
            for (MultipartFile file : gallery) {
                ProductImage img = new ProductImage();
                img.setProduct(product);
                img.setImageUrl(saveFile(file));
                productImageRepository.save(img);
            }
        }

        if (request.getVariants() != null) {
            product.getVariants().clear();
            product = productRepository.saveAndFlush(product);
            saveVariants(product, request.getVariants());
        }

        auditLogService.saveLog(actor, "PRODUCT", "UPDATE", "đã cập nhật sản phẩm: " + request.getName());
        return productRepository.save(product);
    }

    private void validateVariantSkus(List<ProductCreateRequest.VariantRequest> variants) {
        if (variants == null || variants.isEmpty()) return;

        Set<String> skuSet = new HashSet<>();
        for (ProductCreateRequest.VariantRequest v : variants) {
            if (v.getSku() == null || v.getSku().trim().isEmpty()) {
                throw new RuntimeException("SKU biến thể không được để trống!");
            }
            if (!skuSet.add(v.getSku())) {
                throw new RuntimeException("SKU biến thể '" + v.getSku() + "' bị trùng lặp trong danh sách!");
            }
        }
    }

    private void saveVariants(Product product, List<ProductCreateRequest.VariantRequest> variantRequests) {
        for (ProductCreateRequest.VariantRequest varReq : variantRequests) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSku(varReq.getSku());
            variant.setPrice(varReq.getPrice());
            variant.setQuantity(varReq.getQuantity() != null ? varReq.getQuantity() : 0);

            Set<AttributeValue> attrValues = new HashSet<>();

            if (varReq.getAttributes() != null) {
                for (Map.Entry<String, String> entry : varReq.getAttributes().entrySet()) {
                    String key = entry.getKey();
                    String valStr = entry.getValue();

                    if(valStr == null || valStr.trim().isEmpty()) continue;

                    // FIX: Tìm theo Code trước (CPU, RAM...), sau đó mới tìm theo Tên
                    Attribute attribute = attributeRepository.findByCode(key)
                            .or(() -> attributeRepository.findByName(key))
                            .orElseGet(() -> {
                                Attribute newAttr = new Attribute();
                                newAttr.setName(key);
                                newAttr.setCode(key.toUpperCase().replaceAll("\\s+", "_"));
                                return attributeRepository.save(newAttr);
                            });

                    AttributeValue attributeValue = attributeValueRepository.findByAttributeIdAndValue(attribute.getId(), valStr)
                            .orElseGet(() -> {
                                AttributeValue newVal = new AttributeValue();
                                newVal.setAttribute(attribute);
                                newVal.setValue(valStr);
                                return attributeValueRepository.save(newVal);
                            });

                    attrValues.add(attributeValue);
                }
            }
            variant.setAttributeValues(attrValues);

            if (product.getVariants() == null) product.setVariants(new ArrayList<>());
            product.getVariants().add(variant);
        }
    }

    @Transactional
    public void deleteProduct(Long id, String actor) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy SP"));
        deleteFile(product.getThumbnailUrl());
        if (product.getImages() != null) {
            for (ProductImage img : product.getImages()) deleteFile(img.getImageUrl());
        }
        productRepository.delete(product);
        auditLogService.saveLog(actor, "PRODUCT", "DELETE", "đã xóa sản phẩm: " + product.getName());
    }

    private String saveFile(MultipartFile file) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), Paths.get(UPLOAD_DIR + fileName), StandardCopyOption.REPLACE_EXISTING);
        return "/" + UPLOAD_DIR + fileName;
    }

    private void deleteFile(String path) {
        if (path == null) return;
        try {
            String realPath = path.startsWith("/") ? path.substring(1) : path;
            Files.deleteIfExists(Paths.get(realPath));
        } catch (Exception e) {}
    }
}