package com.belchiorsapalo.formCenterApi.course.dtos;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CourseRegisterDTO(
        @NotBlank(message = "O título é obrigatório")
        @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9\\s\\-.,!?:()']+$",
                message = "O título contém caracteres inválidos"
        )
        String title,

        @NotBlank(message = "A descrição é obrigatória")
        @Size(min = 10, max = 1000, message = "A descrição deve ter entre 10 e 1000 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÖØ-öø-ÿ0-9\\s\\-.,!?:()'\"]+$",
                message = "A descrição contém caracteres inválidos"
        )
        String description,

        @NotBlank(message = "A duração é obrigatória")
        @Pattern(
                regexp = "^[0-9]+\\s*(h|hora|horas|min|minuto|minutos|dia|dias|semana|semanas)$",
               message = "A duração deve estar no formato correto, ex: '2 horas', '45 min', '5 dias' ou '1 semana'"

)
        String duration,

        boolean payed,

        @DecimalMin(value = "0.0", inclusive = true, message = "O preço não pode ser negativo")
        BigDecimal price,

        @NotNull(message = "O número de vagas é obrigatório")
        @Min(value = 1, message = "Deve haver pelo menos uma vaga")
        Integer vacancies
) {

}
