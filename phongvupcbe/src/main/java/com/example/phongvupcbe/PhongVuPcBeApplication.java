package com.example.phongvupcbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PhongVuPcBeApplication {

    public static void main(String[] args) {
          SpringApplication.run(PhongVuPcBeApplication.class, args);
//        PasswordEncoder encoder = new BCryptPasswordEncoder();
//
//        String rawPassword = "123456";
//
//        String encodedString = encoder.encode(rawPassword);
//
//        System.out.println("Mật khẩu gốc: " + rawPassword);
//        System.out.println("Chuỗi BCrypt mới: " + encodedString);
    }

}
