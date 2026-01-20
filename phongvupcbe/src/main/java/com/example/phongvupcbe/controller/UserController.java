package com.example.phongvupcbe.controller;

import com.example.phongvupcbe.model.User;
import com.example.phongvupcbe.service.AuditLogService;
import com.example.phongvupcbe.service.impl.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest, HttpServletRequest request) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        auditLogService.saveLog(user.getUsername(), "AUTH", "LOGIN", "đã đăng nhập từ IP: " + request.getRemoteAddr());
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        return ResponseEntity.ok(userService.createUser(user, actor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User user, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        return ResponseEntity.ok(userService.updateUser(id, user, actor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader(value = "X-Actor", defaultValue = "SYSTEM") String actor) {
        userService.deleteUser(id, actor);
        return ResponseEntity.ok("Thành công");
    }
}
