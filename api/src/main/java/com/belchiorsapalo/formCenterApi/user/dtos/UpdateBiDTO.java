package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Pattern;

public record UpdateBiDTO(
        @Pattern(regexp = "^\\d{9}[A-Z]{2}\\d{3}$", message = "O número de BI deve ser válido")
        String bi
) {
}
