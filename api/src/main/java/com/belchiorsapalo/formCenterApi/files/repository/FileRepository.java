package com.belchiorsapalo.formCenterApi.files.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.belchiorsapalo.formCenterApi.files.model.File;

public interface FileRepository extends JpaRepository<File, UUID>{
    
}
