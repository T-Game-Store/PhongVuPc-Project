package com.example.phongvupcbe.service;

import com.example.phongvupcbe.model.Warehouse;
import java.util.List;

public interface WarehouseService {
    List<Warehouse> getAll();
    Warehouse save(Warehouse warehouse);
    Warehouse update(Long id, Warehouse warehouse);
    void delete(Long id);
}