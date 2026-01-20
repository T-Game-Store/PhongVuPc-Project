package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.User;
import com.example.phongvupcbe.repository.UserRepository;
import com.example.phongvupcbe.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserServiceImpl {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuditLogService auditLogService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user, String actorName) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        auditLogService.saveLog(actorName, "USER", "CREATE", "đã tạo tài khoản nhân sự: " + savedUser.getUsername());
        return savedUser;
    }

    public User updateUser(Long id, User userRequest, String actorName) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy nhân sự!"));
        if (!existingUser.getRole().equals(userRequest.getRole())) {
            auditLogService.saveLog(actorName, "ROLE", "UPDATE", "đã đổi quyền của " + existingUser.getUsername() + " sang " + userRequest.getRole());
        }
        existingUser.setEmail(userRequest.getEmail());
        existingUser.setRole(userRequest.getRole());
        existingUser.setStatus(userRequest.getStatus());
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id, String actorName) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy nhân sự!"));
        user.setStatus("inactive");
        userRepository.save(user);
        auditLogService.saveLog(actorName, "USER", "DELETE", "đã khóa tài khoản: " + user.getUsername());
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại!"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }
        return user;
    }
}