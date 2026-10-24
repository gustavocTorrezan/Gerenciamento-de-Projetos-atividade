package com.faculdade.instagram.controller;

import com.faculdade.instagram.database.BancoDeDadosMemoria;
import com.faculdade.instagram.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private BancoDeDadosMemoria bancoDeDados;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return bancoDeDados.getUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return bancoDeDados.buscarUsuarioPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
