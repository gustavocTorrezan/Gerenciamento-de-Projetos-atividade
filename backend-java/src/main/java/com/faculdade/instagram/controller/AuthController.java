package com.faculdade.instagram.controller;

import com.faculdade.instagram.database.BancoDeDadosMemoria;
import com.faculdade.instagram.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private BancoDeDadosMemoria bancoDeDados;

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciais) {
        String usuario = credenciais.get("usuario");
        String senha = credenciais.get("senha");
        return bancoDeDados.autenticar(usuario, senha)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody Map<String, String> dados) {
        String usuario = dados.get("usuario");
        String senha = dados.get("senha");
        if (usuario == null || senha == null || usuario.trim().isEmpty() || senha.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Usuario novo = bancoDeDados.registrarUsuario(usuario, senha);
        return ResponseEntity.ok(novo);
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return bancoDeDados.getUsuarios();
    }
}
