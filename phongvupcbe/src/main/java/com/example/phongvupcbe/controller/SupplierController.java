package com.example.phongvupcbe.controller;

import com.example.phongvupcbe.model.Supplier;
import com.example.phongvupcbe.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAll() { return supplierService.getAll(); }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) { return supplierService.create(supplier); }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier) {
        return supplierService.update(id, supplier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { supplierService.delete(id); }
}