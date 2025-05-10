package com.belchiorsapalo.formCenterApi.user.dtos;

import com.belchiorsapalo.formCenterApi.user.model.UserRole;

public record UserProfileDTO(String name, String email, String bi, String phoneNumber, UserRole role) {
    
}
