package com.faculdade.instagram.database;

import com.faculdade.instagram.model.Comentario;
import com.faculdade.instagram.model.Post;
import com.faculdade.instagram.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BancoDeDadosMemoria {
    private List<Usuario> usuarios;
    private List<Post> posts;
    private long proximoPostId = 3L;

    public BancoDeDadosMemoria() {
        this.usuarios = new ArrayList<>();
        this.posts = new ArrayList<>();
        carregarDadosIniciais();
    }

    private void carregarDadosIniciais() {
        Usuario u1 = new Usuario(1L, "estudante.cc", "Estudante de Computacao", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "1o Ano de Ciencia da Computacao | Java & React Native");
        Usuario u2 = new Usuario(2L, "ada.lovelace", "Ada Lovelace", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", "Entusiasta de algoritmos e programacao.");
        usuarios.add(u1);
        usuarios.add(u2);

        long agora = System.currentTimeMillis();
        Post p1 = new Post(1L, u2.getNomeUsuario(), u2.getFotoPerfilUrl(), "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600", "Comecando os estudos de Programacao Orientada a Objetos em Java!", 12, false, agora - 3600000);
        p1.adicionarComentario(new Comentario(1L, "estudante.cc", "Muito bom!", agora - 1800000));

        Post p2 = new Post(2L, u1.getNomeUsuario(), u1.getFotoPerfilUrl(), "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", "Configurando nosso projeto do bimestre com a equipe!", 25, true, agora);
        p2.adicionarComentario(new Comentario(2L, "ada.lovelace", "Ficou excelente a arquitetura!", agora - 600000));

        posts.add(p1);
        posts.add(p2);
    }

    public List<Usuario> getUsuarios() { return usuarios; }

    public List<Post> getPosts() {
        return posts.stream().sorted(Comparator.comparingLong(Post::getTimestampCriacao).reversed()).collect(Collectors.toList());
    }

    public Post adicionarPost(String nomeUsuario, String fotoPerfilUrl, String imagemUrl, String legenda) {
        Post novo = new Post(proximoPostId++, nomeUsuario, fotoPerfilUrl, imagemUrl, legenda, 0, false, System.currentTimeMillis());
        posts.add(novo);
        return novo;
    }
}
