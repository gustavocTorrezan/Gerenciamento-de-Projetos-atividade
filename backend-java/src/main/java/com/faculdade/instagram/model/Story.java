package com.faculdade.instagram.model;

public class Story {
    private Long id;
    private String nomeUsuario;
    private String avatarUrl;
    private String imagemUrl;
    private String legenda;

    public Story() {}

    public Story(Long id, String nomeUsuario, String avatarUrl, String imagemUrl, String legenda) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.avatarUrl = avatarUrl;
        this.imagemUrl = imagemUrl;
        this.legenda = legenda;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public String getLegenda() { return legenda; }
    public void setLegenda(String legenda) { this.legenda = legenda; }
}
