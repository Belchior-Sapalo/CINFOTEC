package com.belchiorsapalo.formCenterApi.course.dtos;

import java.math.BigDecimal;

public record CourseRegisterDTO(String title, String description, String duration, boolean payed, BigDecimal price, Integer vacancies) {

}
