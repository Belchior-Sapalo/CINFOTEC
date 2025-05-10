package com.belchiorsapalo.formCenterApi.user.dtos;

import jakarta.validation.constraints.NotNull;

public record UserLoginDTO(
    @NotNull(message = "Insira o seu email")
    String email, 

    @NotNull(message = "Insira sua senha")
    String password
) {
    
}
