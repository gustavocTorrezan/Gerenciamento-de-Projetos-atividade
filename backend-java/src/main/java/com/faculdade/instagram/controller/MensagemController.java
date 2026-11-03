package com.faculdade.instagram.controller;

import com.faculdade.instagram.database.BancoDeDadosMemoria;
import com.faculdade.instagram.model.Mensagem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    @Autowired
    private BancoDeDadosMemoria bancoDeDados;

    @GetMapping
    public List<Mensagem> listarConversa(@RequestParam String user1, @RequestParam String user2) {
        return bancoDeDados.listarMensagensEntre(user1, user2);
    }

    @PostMapping
    public Mensagem enviarMensagem(@RequestBody Map<String, String> payload) {
        String remetente = payload.get("remetente");
        String destinatario = payload.get("destinatario");
        String texto = payload.get("texto");
        return bancoDeDados.enviarMensagem(remetente, destinatario, texto);
    }
}
