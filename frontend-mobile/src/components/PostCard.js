import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function PostCard({ post, onCurtir, onComentar }) {
  const [novoComentario, setNovoComentario] = useState('');

  function enviarComentario() {
    if (!novoComentario.trim()) return;
    onComentar(novoComentario);
    setNovoComentario('');
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.fotoPerfilUsuarioUrl }} style={styles.avatar} />
        <Text style={styles.username}>{post.nomeUsuario}</Text>
      </View>
      <Image source={{ uri: post.imagemUrl }} style={styles.postImage} />
      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onCurtir} style={styles.likeButton}>
            <Text style={[styles.likeIcon, post.curtidoPeloUsuarioAtual && styles.liked]}>
              {post.curtidoPeloUsuarioAtual ? '♥ Curtido' : '♡ Curtir'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.likes}>{post.quantidadeCurtidas} curtidas</Text>
        <Text style={styles.caption}>
          <Text style={styles.username}>{post.nomeUsuario} </Text>
          {post.legenda}
        </Text>

        {post.comentarios && post.comentarios.map((c) => (
          <Text key={String(c.id)} style={styles.commentText}>
            <Text style={styles.username}>{c.nomeUsuario} </Text>
            {c.texto}
          </Text>
        ))}

        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicione um comentario..."
            value={novoComentario}
            onChangeText={setNovoComentario}
          />
          <TouchableOpacity onPress={enviarComentario}>
            <Text style={styles.sendText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  username: { fontWeight: 'bold', fontSize: 14, color: '#262626' },
  postImage: { width: '100%', height: 320, backgroundColor: '#EFEFEF' },
  footer: { padding: 12 },
  actions: { flexDirection: 'row', marginBottom: 8 },
  likeButton: { paddingVertical: 4 },
  likeIcon: { fontSize: 15, fontWeight: '600', color: '#262626' },
  liked: { color: '#ED4956' },
  likes: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  caption: { fontSize: 14, color: '#262626', marginBottom: 6 },
  commentText: { fontSize: 13, color: '#262626', marginTop: 3 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#EFEFEF', paddingTop: 8 },
  commentInput: { flex: 1, fontSize: 13, paddingVertical: 4 },
  sendText: { color: '#0095F6', fontWeight: 'bold', fontSize: 13, marginLeft: 10 },
});
