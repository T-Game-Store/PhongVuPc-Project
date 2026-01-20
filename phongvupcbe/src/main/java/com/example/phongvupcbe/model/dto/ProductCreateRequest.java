package com.example.phongvupcbe.model.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ProductCreateRequest {
    private String name;
    private String sku;
    private String brand;
    private String description;
    private List<Long> categoryIds;
    private Boolean isNew;
    private Boolean isBestSeller;
    private String status;

    private List<VariantRequest> variants;

    @Data
    public static class VariantRequest {
        private String sku;
        private BigDecimal price;
        private Integer quantity;
        private Map<String, String> attributes;
    }
}