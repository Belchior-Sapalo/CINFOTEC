package com.belchiorsapalo.formCenterApi.enrollment.dtos;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

public record EnrollmentRegisterDTO(String token, UUID courseId, MultipartFile file) {
    
}
