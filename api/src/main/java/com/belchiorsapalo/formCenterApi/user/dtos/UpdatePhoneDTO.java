package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Pattern;

public record UpdatePhoneDTO(
        @Pattern(regexp = "\\d{9}", message = "O número de telefone deve possuir 9 dígitos")
        String phoneNumber
) {
}
