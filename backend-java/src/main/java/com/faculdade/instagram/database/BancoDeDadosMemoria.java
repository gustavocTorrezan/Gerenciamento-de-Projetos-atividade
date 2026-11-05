package com.faculdade.instagram.database;

import com.faculdade.instagram.model.Comentario;
import com.faculdade.instagram.model.Mensagem;
import com.faculdade.instagram.model.Post;
import com.faculdade.instagram.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class BancoDeDadosMemoria {
    private List<Usuario> usuarios;
    private List<Post> posts;
    private List<Mensagem> mensagens;
    private long proximoPostId = 3L;
    private long proximoComentarioId = 3L;
    private long proximaMensagemId = 1L;

    public BancoDeDadosMemoria() {
        this.usuarios = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.mensagens = new ArrayList<>();
        carregarDadosIniciais();
    }

    private void carregarDadosIniciais() {
        Usuario u1 = new Usuario(1L, "estudante.cc", "Estudante de Computacao", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "1o Ano de Ciencia da Computacao", "1234");
        Usuario u2 = new Usuario(2L, "ada.lovelace", "Ada Lovelace", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", "Entusiasta de algoritmos", "1234");
        usuarios.add(u1);
        usuarios.add(u2);

        long agora = System.currentTimeMillis();
        mensagens.add(new Mensagem(proximaMensagemId++, "ada.lovelace", "estudante.cc", "Ola! Bem-vindo ao InstaCC!", agora - 500000));

        Post p1 = new Post(1L, u2.getNomeUsuario(), u2.getFotoPerfilUrl(), "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600", "Estudando Java POO!", 12, false, agora - 3600000);
        p1.adicionarComentario(new Comentario(1L, "estudante.cc", "Muito bom!", agora - 1800000));
        
        Post p2 = new Post(2L, u1.getNomeUsuario(), u1.getFotoPerfilUrl(), "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", "Configurando o projeto!", 25, true, agora);

        posts.add(p1);
        posts.add(p2);
    }

    public List<Usuario> getUsuarios() { 
        return usuarios; 
    }

    public Optional<Usuario> buscarUsuarioPorId(Long id) {
        return usuarios.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public Optional<Usuario> autenticar(String nomeUsuario, String senha) {
        return usuarios.stream()
                .filter(u -> u.getNomeUsuario().equals(nomeUsuario) && u.getSenha().equals(senha))
                .findFirst();
    }

    public Usuario registrarUsuario(String nomeUsuario, String senha) {
        long novoId = usuarios.size() + 1L;
        Usuario novo = new Usuario(novoId, nomeUsuario, nomeUsuario, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "Novo usuario do InstaCC", senha);
        usuarios.add(novo);
        return novo;
    }

    public List<Post> getPosts() {
        return posts.stream().sorted(Comparator.comparingLong(Post::getTimestampCriacao).reversed()).collect(Collectors.toList());
    }

    public Post adicionarPost(String nomeUsuario, String fotoPerfilUrl, String imagemUrl, String legenda) {
        Post novo = new Post(proximoPostId++, nomeUsuario, fotoPerfilUrl, imagemUrl, legenda, 0, false, System.currentTimeMillis());
        posts.add(novo);
        return novo;
    }

    public Optional<Post> alternarCurtida(Long postId) {
        Optional<Post> postOpt = posts.stream().filter(p -> p.getId().equals(postId)).findFirst();
        postOpt.ifPresent(post -> {
            if (post.isCurtidoPeloUsuarioAtual()) {
                post.setCurtidoPeloUsuarioAtual(false);
                post.setQuantidadeCurtidas(Math.max(0, post.getQuantidadeCurtidas() - 1));
            } else {
                post.setCurtidoPeloUsuarioAtual(true);
                post.setQuantidadeCurtidas(post.getQuantidadeCurtidas() + 1);
            }
        });
        return postOpt;
    }

    public Optional<Post> adicionarComentario(Long postId, String nomeUsuario, String texto) {
        Optional<Post> postOpt = posts.stream().filter(p -> p.getId().equals(postId)).findFirst();
        postOpt.ifPresent(post -> {
            post.adicionarComentario(new Comentario(proximoComentarioId++, nomeUsuario, texto, System.currentTimeMillis()));
        });
        return postOpt;
    }

    public List<Mensagem> listarMensagensEntre(String user1, String user2) {
        return mensagens.stream()
                .filter(m -> (m.getRemetente().equals(user1) && m.getDestinatario().equals(user2)) ||
                             (m.getRemetente().equals(user2) && m.getDestinatario().equals(user1)))
                .sorted(Comparator.comparingLong(Mensagem::getTimestamp))
                .collect(Collectors.toList());
    }

    public Mensagem enviarMensagem(String remetente, String destinatario, String texto) {
        Mensagem m = new Mensagem(proximaMensagemId++, remetente, destinatario, texto, System.currentTimeMillis());
        mensagens.add(m);
        return m;
    }
}