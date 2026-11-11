package com.faculdade.instagram.controller;

import com.faculdade.instagram.database.BancoDeDadosMemoria;
import com.faculdade.instagram.model.Story;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
@CrossOrigin(origins = "*")
public class StoryController {

    @Autowired
    private BancoDeDadosMemoria bancoDeDados;

    @GetMapping
    public List<Story> listarStories() {
        return bancoDeDados.listarStories();
    }

    @PostMapping
    public ResponseEntity<Story> criarStory(@RequestBody Map<String, String> payload) {
        String nomeUsuario = payload.getOrDefault("nomeUsuario", "estudante.cc");
        String imagemUrl = payload.get("imagemUrl");
        String legenda = payload.getOrDefault("legenda", "");
        if (imagemUrl == null || imagemUrl.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Story novo = bancoDeDados.adicionarStory(nomeUsuario.trim(), imagemUrl.trim(), legenda.trim());
        return ResponseEntity.ok(novo);
    }
}
