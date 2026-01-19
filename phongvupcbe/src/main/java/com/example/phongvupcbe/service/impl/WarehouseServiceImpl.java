package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.Warehouse;
import com.example.phongvupcbe.repository.WarehouseRepository;
import com.example.phongvupcbe.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {
    @Autowired
    private WarehouseRepository warehouseRepository;

    @Override
    public List<Warehouse> getAll() { return warehouseRepository.findAll(); }

    @Override
    public Warehouse save(Warehouse warehouse) { return warehouseRepository.save(warehouse); }

    @Override
    public Warehouse update(Long id, Warehouse warehouse) {
        Warehouse existing = warehouseRepository.findById(id).orElseThrow();
        existing.setName(warehouse.getName());
        existing.setAddress(warehouse.getAddress());
        existing.setStatus(warehouse.getStatus());
        return warehouseRepository.save(existing);
    }

    @Override
    public void delete(Long id) { warehouseRepository.deleteById(id); }
}