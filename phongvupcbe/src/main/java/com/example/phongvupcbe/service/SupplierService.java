package com.example.phongvupcbe.service;
import com.example.phongvupcbe.model.Supplier;
import java.util.List;

public interface SupplierService {
    List<Supplier> getAll();
    Supplier create(Supplier supplier, String actor);
    Supplier update(Long id, Supplier supplier, String actor);
    void delete(Long id, String actor);
}