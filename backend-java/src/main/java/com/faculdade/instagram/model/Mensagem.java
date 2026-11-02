package com.faculdade.instagram.model;

public class Mensagem {
    private Long id;
    private String remetente;
    private String destinatario;
    private String texto;
    private long timestamp;

    public Mensagem() {}

    public Mensagem(Long id, String remetente, String destinatario, String texto, long timestamp) {
        this.id = id;
        this.remetente = remetente;
        this.destinatario = destinatario;
        this.texto = texto;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRemetente() { return remetente; }
    public void setRemetente(String remetente) { this.remetente = remetente; }
    public String getDestinatario() { return destinatario; }
    public void setDestinatario(String destinatario) { this.destinatario = destinatario; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
