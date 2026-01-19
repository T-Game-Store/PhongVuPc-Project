package com.example.phongvupcbe.service;

import com.example.phongvupcbe.model.Supplier;

import java.util.List;

public interface SupplierService {
    List<Supplier> getAll();
    Supplier create(Supplier supplier);
    Supplier update(Long id, Supplier supplier);
    void delete(Long id);
}