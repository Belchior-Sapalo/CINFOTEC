package com.belchiorsapalo.formCenterApi.information.controller;

import java.net.MalformedURLException;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.belchiorsapalo.formCenterApi.information.dtos.InfoRegisterDTO;
import com.belchiorsapalo.formCenterApi.information.model.Information;
import com.belchiorsapalo.formCenterApi.information.service.InformationService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/informations")
public class InformationController {
    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @GetMapping
    public ResponseEntity<List<Information>> getAll(){
        return ResponseEntity.ok().body(informationService.getAll());
    }

    //Testado, sucesso
    @GetMapping("/{id}")
    public ResponseEntity<Information> getOne(@PathVariable UUID id){
        return ResponseEntity.ok().body(informationService.getOne(id));
    }

    //Testado, sucesso
    @GetMapping("/image/{id}")
    public ResponseEntity<Resource> getInfoImg(@PathVariable UUID id) throws MalformedURLException{
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // Altere conforme o tipo da imagem (PNG, etc.)
                .body(informationService.getInfoImg(id));
    }

    //Testado, sucesso
    @PostMapping("/register")
    public ResponseEntity<Information> register(
        @RequestParam("title") String title,
        @RequestParam("category") String category,
        @RequestParam("body") String body,
        @RequestParam("image") MultipartFile image
    ) {
            return ResponseEntity.status(HttpStatus.CREATED).body(informationService.register(title, category, body, image));
    }

    //Testado, sucesso
    @PutMapping("/update/{id}")
    public ResponseEntity<String> update(@PathVariable UUID id, @RequestBody InfoRegisterDTO infoRegisterDTO){
        informationService.update(id, infoRegisterDTO);
        return ResponseEntity.ok().body("Informação atualizada");
    }

    //Testado, sucesso
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable UUID id){
        informationService.delete(id);
        return ResponseEntity.ok().build();
    }
}
