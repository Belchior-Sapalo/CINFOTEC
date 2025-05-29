package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateNameDTO(
        @Pattern(regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$", message = "Nome inválido: use apenas letras e espaços")
        @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
        String name
) {
}
