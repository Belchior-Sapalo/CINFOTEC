package com.belchiorsapalo.formCenterApi.information.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record InfoRegisterDTO(

        @NotBlank(message = "O título é obrigatório")
        @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9\\s\\-.,!?:()']+$",
                message = "O título contém caracteres inválidos"
        )
        String title,

        @NotBlank(message = "A categoria é obrigatória")
        @Size(min = 2, max = 50, message = "A categoria deve ter entre 2 e 50 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ\\s\\-]+$",
                message = "A categoria deve conter apenas letras, espaços e hífens"
        )
        String category,

        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(min = 10, max = 5000, message = "O corpo da informação deve ter entre 10 e 5000 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9\\s\\-.,!?:()'\"\\n\\r]+$",
                message = "O corpo da informação contém caracteres inválidos"
        )
        String body
) {
}
