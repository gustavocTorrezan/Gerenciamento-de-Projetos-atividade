package com.faculdade.instagram.model;

public class Usuario {
    private Long id;
    private String nomeUsuario;
    private String nomeCompleto;
    private String fotoPerfilUrl;
    private String bio;
    private String senha;

    public Usuario() {}

    public Usuario(Long id, String nomeUsuario, String nomeCompleto, String fotoPerfilUrl, String bio, String senha) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.nomeCompleto = nomeCompleto;
        this.fotoPerfilUrl = fotoPerfilUrl;
        this.bio = bio;
        this.senha = senha;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    public String getFotoPerfilUrl() { return fotoPerfilUrl; }
    public void setFotoPerfilUrl(String fotoPerfilUrl) { this.fotoPerfilUrl = fotoPerfilUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
