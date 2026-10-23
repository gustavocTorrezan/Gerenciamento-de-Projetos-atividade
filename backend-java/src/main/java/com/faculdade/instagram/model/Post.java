package com.faculdade.instagram.model;

import java.util.ArrayList;
import java.util.List;

public class Post {
    private Long id;
    private String nomeUsuario;
    private String fotoPerfilUsuarioUrl;
    private String imagemUrl;
    private String legenda;
    private int quantidadeCurtidas;
    private boolean curtidoPeloUsuarioAtual;
    private long timestampCriacao;
    private List<Comentario> comentarios;

    public Post() {
        this.comentarios = new ArrayList<>();
    }

    public Post(Long id, String nomeUsuario, String fotoPerfilUsuarioUrl, String imagemUrl, String legenda, int quantidadeCurtidas, boolean curtidoPeloUsuarioAtual, long timestampCriacao) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.fotoPerfilUsuarioUrl = fotoPerfilUsuarioUrl;
        this.imagemUrl = imagemUrl;
        this.legenda = legenda;
        this.quantidadeCurtidas = quantidadeCurtidas;
        this.curtidoPeloUsuarioAtual = curtidoPeloUsuarioAtual;
        this.timestampCriacao = timestampCriacao;
        this.comentarios = new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public String getFotoPerfilUsuarioUrl() { return fotoPerfilUsuarioUrl; }
    public void setFotoPerfilUsuarioUrl(String fotoPerfilUsuarioUrl) { this.fotoPerfilUsuarioUrl = fotoPerfilUsuarioUrl; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public String getLegenda() { return legenda; }
    public void setLegenda(String legenda) { this.legenda = legenda; }
    public int getQuantidadeCurtidas() { return quantidadeCurtidas; }
    public void setQuantidadeCurtidas(int quantidadeCurtidas) { this.quantidadeCurtidas = quantidadeCurtidas; }
    public boolean isCurtidoPeloUsuarioAtual() { return curtidoPeloUsuarioAtual; }
    public void setCurtidoPeloUsuarioAtual(boolean curtidoPeloUsuarioAtual) { this.curtidoPeloUsuarioAtual = curtidoPeloUsuarioAtual; }
    public long getTimestampCriacao() { return timestampCriacao; }
    public void setTimestampCriacao(long timestampCriacao) { this.timestampCriacao = timestampCriacao; }
    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> comentarios) { this.comentarios = comentarios; }
    public void adicionarComentario(Comentario comentario) { this.comentarios.add(comentario); }
}
