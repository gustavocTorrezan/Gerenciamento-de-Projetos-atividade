package com.faculdade.instagram.controller;

import com.faculdade.instagram.database.BancoDeDadosMemoria;
import com.faculdade.instagram.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private BancoDeDadosMemoria bancoDeDados;

    @GetMapping
    public List<Post> listarPosts() {
        return bancoDeDados.getPosts();
    }

    @PostMapping
    public Post criarPost(@RequestBody Map<String, String> payload) {
        String nomeUsuario = payload.getOrDefault("nomeUsuario", "estudante.cc");
        String fotoPerfilUrl = payload.getOrDefault("fotoPerfilUsuarioUrl", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        String imagemUrl = payload.getOrDefault("imagemUrl", "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600");
        String legenda = payload.getOrDefault("legenda", "");
        return bancoDeDados.adicionarPost(nomeUsuario, fotoPerfilUrl, imagemUrl, legenda);
    }
}
