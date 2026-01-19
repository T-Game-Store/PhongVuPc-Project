package com.example.phongvupcbe.service.impl;

import com.example.phongvupcbe.model.Customer;
import com.example.phongvupcbe.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerServiceImpl {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer register(Customer customer) {
        if (customerRepository.existsByUsername(customer.getUsername())) {
            throw new RuntimeException("Tên đăng nhập khách hàng đã tồn tại!");
        }
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return customerRepository.save(customer);
    }

    public Customer login(String username, String password) {
        Customer customer = customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản khách hàng không tồn tại!"));

        if (!passwordEncoder.matches(password, customer.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }
        return customer;
    }

    public Customer updateCustomer(Long id, Customer req) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));

        existing.setFullName(req.getFullName());
        existing.setEmail(req.getEmail());
        existing.setPhone(req.getPhone());
        existing.setAddress(req.getAddress());
        existing.setStatus(req.getStatus());

        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return customerRepository.save(existing);
    }

    public void deleteCustomer(Long id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
        c.setStatus("inactive");
        customerRepository.save(c);
    }
}