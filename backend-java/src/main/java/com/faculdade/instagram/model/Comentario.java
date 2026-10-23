package com.faculdade.instagram.model;

public class Comentario {
    private Long id;
    private String nomeUsuario;
    private String texto;
    private long timestamp;

    public Comentario() {
    }

    public Comentario(Long id, String nomeUsuario, String texto, long timestamp) {
        this.id = id;
        this.nomeUsuario = nomeUsuario;
        this.texto = texto;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
