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
    public Supplier create(@RequestBody Supplier supplier, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        return supplierService.create(supplier, actor);
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable Long id, @RequestBody Supplier supplier, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        return supplierService.update(id, supplier, actor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        supplierService.delete(id, actor);
    }
}