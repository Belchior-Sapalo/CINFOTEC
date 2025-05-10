package com.belchiorsapalo.formCenterApi.information.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.belchiorsapalo.formCenterApi.information.model.Information;

public interface InformationRepository extends JpaRepository<Information, UUID>{
    boolean existsByTitle(String title);
}
