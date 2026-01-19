package com.example.phongvupcbe.controller;

import com.example.phongvupcbe.model.Warehouse;
import com.example.phongvupcbe.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
public class WarehouseController {
    @Autowired
    private WarehouseService warehouseService;

    @GetMapping
    public List<Warehouse> getAll() { return warehouseService.getAll(); }

    @PostMapping
    public Warehouse create(@RequestBody Warehouse warehouse) { return warehouseService.save(warehouse); }

    @PutMapping("/{id}")
    public Warehouse update(@PathVariable Long id, @RequestBody Warehouse warehouse) { return warehouseService.update(id, warehouse); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { warehouseService.delete(id); }
}