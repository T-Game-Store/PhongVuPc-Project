package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.Supplier;
import com.example.phongvupcbe.repository.SupplierRepository;
import com.example.phongvupcbe.service.AuditLogService;
import com.example.phongvupcbe.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public List<Supplier> getAll() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier create(Supplier supplier, String actor) {
        Supplier saved = supplierRepository.save(supplier);
        auditLogService.saveLog(actor, "SUPPLIER", "CREATE", "đã thêm nhà cung cấp: " + saved.getName());
        return saved;
    }

    @Override
    public Supplier update(Long id, Supplier supplier, String actor) {
        Supplier existing = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy NCC!"));

        existing.setName(supplier.getName());
        existing.setType(supplier.getType());
        existing.setContactName(supplier.getContactName());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setAddress(supplier.getAddress());
        existing.setStatus(supplier.getStatus());

        auditLogService.saveLog(actor, "SUPPLIER", "UPDATE", "đã cập nhật thông tin NCC: " + existing.getName());
        return supplierRepository.save(existing);
    }

    @Override
    public void delete(Long id, String actor) {
        Supplier s = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy NCC!"));
        supplierRepository.deleteById(id);
        auditLogService.saveLog(actor, "SUPPLIER", "DELETE", "đã xóa nhà cung cấp: " + s.getName());
    }
}