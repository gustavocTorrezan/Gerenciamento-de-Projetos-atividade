import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function PostCard({ post, onCurtir, onComentar }) {
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [curtido, setCurtido] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(Number(post?.curtidas || 0));

  useEffect(() => {
    setTotalCurtidas(Number(post?.curtidas || 0));
  }, [post?.curtidas]);

  const nomeAutor = post?.nomeUsuario || 'estudante.cc';
  const avatarAutor =
    post?.avatarUrl ||
    `https://ui-avatars.com/api/?background=0095F6&color=fff&name=${encodeURIComponent(nomeAutor)}`;
  const listaComentarios = Array.isArray(post?.comentarios) ? post.comentarios : [];

  function clicarCurtir() {
    const novoValor = totalCurtidas + 1;
    setCurtido(true);
    setTotalCurtidas(novoValor);
    if (onCurtir) {
      onCurtir(post.id, novoValor);
    }
  }

  function enviarComentario() {
    if (!comentarioTexto.trim()) return;
    onComentar && onComentar(post.id, comentarioTexto.trim());
    setComentarioTexto('');
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarAutor }} style={styles.avatar} />
        <Text style={styles.username}>@{nomeAutor}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.imagemUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.likeButton, curtido && styles.likeButtonAtivo]}
            onPress={clicarCurtir}
            activeOpacity={0.7}
          >
            <Text style={[styles.likeIcon, curtido && styles.likeIconAtivo]}>♥</Text>
            <Text style={[styles.likeCount, curtido && styles.likeCountAtivo]}>
              {totalCurtidas} {totalCurtidas === 1 ? 'curtida' : 'curtidas'}
            </Text>
          </TouchableOpacity>
        </View>

        {!!post.legenda && (
          <Text style={styles.caption}>
            <Text style={styles.captionUser}>@{nomeAutor} </Text>
            {post.legenda}
          </Text>
        )}

        {listaComentarios.length > 0 && (
          <View style={styles.commentsSection}>
            {listaComentarios.map((c, index) => {
              const autorCom = c.autor || c.nomeUsuario || 'usuario';
              return (
                <Text key={String(c.id || index)} style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>@{autorCom}: </Text>
                  {c.texto}
                </Text>
              );
            })}
          </View>
        )}

        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#999"
            value={comentarioTexto}
            onChangeText={setComentarioTexto}
          />
          <TouchableOpacity onPress={enviarComentario} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 18,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#EFEFEF',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  imageContainer: {
    width: '100%',
    height: 420,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD6DF',
  },
  likeButtonAtivo: {
    backgroundColor: '#ED4956',
    borderColor: '#ED4956',
  },
  likeIcon: {
    color: '#ED4956',
    fontSize: 16,
    marginRight: 6,
  },
  likeIconAtivo: {
    color: '#FFFFFF',
  },
  likeCount: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#262626',
  },
  likeCountAtivo: {
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
    marginBottom: 8,
  },
  captionUser: {
    fontWeight: 'bold',
  },
  commentsSection: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentItem: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: '#262626',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#262626',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sendButtonText: {
    color: '#0095F6',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
