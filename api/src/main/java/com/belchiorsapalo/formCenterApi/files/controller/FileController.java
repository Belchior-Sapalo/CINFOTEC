package com.belchiorsapalo.formCenterApi.files.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.files.model.File;
import com.belchiorsapalo.formCenterApi.files.service.FileService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {
   private final FileService fileService;

   public FileController(FileService fileService) {
      this.fileService = fileService;
   }

   @GetMapping("/download/{fileName:.+}")
   public ResponseEntity<Resource> download(@PathVariable String fileName, HttpServletRequest request)
         throws IOException {
      return fileService.download(fileName, request);
   }

   @GetMapping("/list")
   public ResponseEntity<List<String>> listFiles() throws IOException {
      return ResponseEntity.ok().body(fileService.listFiles());
   }
}
