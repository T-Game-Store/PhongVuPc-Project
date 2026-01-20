package com.example.phongvupcbe.service;

import com.example.phongvupcbe.model.AuditLog;
import com.example.phongvupcbe.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void saveLog(String actorName, String module, String action, String data) {
        AuditLog log = new AuditLog();
        log.setUsername(actorName != null ? actorName : "SYSTEM");
        log.setModule(module);
        log.setAction(action);
        log.setDataAfter(data);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }
}