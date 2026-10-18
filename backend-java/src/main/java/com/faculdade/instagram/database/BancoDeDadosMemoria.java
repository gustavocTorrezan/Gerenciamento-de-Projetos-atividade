package com.faculdade.instagram.database;

import com.faculdade.instagram.model.Post;
import com.faculdade.instagram.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BancoDeDadosMemoria {
    private List<Usuario> usuarios;
    private List<Post> posts;

    public BancoDeDadosMemoria() {
        this.usuarios = new ArrayList<>();
        this.posts = new ArrayList<>();
        carregarDadosIniciais();
    }

    private void carregarDadosIniciais() {
        Usuario u1 = new Usuario(
                1L,
                "estudante.cc",
                "Estudante de Computação",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "1º Ano de Ciência da Computação 💻 | Java & React Native"
        );
        Usuario u2 = new Usuario(
                2L,
                "ada.lovelace",
                "Ada Lovelace",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                "Entusiasta de algoritmos e programação."
        );

        usuarios.add(u1);
        usuarios.add(u2);

        long agora = System.currentTimeMillis();

        Post p1 = new Post(
                1L,
                u2.getNomeUsuario(),
                u2.getFotoPerfilUrl(),
                "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                "Começando os estudos de Programação Orientada a Objetos em Java!",
                12,
                false,
                agora - 3600000
        );

        Post p2 = new Post(
                2L,
                u1.getNomeUsuario(),
                u1.getFotoPerfilUrl(),
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
                "Configurando nosso projeto do bimestre com a equipe!",
                25,
                true,
                agora
        );

        posts.add(p1);
        posts.add(p2);
    }

    public List<Usuario> getUsuarios() {
        return usuarios;
    }

    public List<Post> getPosts() {
        return posts;
    }
}
