import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StyleSheet
} from 'react-native';

export default function PostCard({ post, onCurtir, onComentar }) {
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [curtido, setCurtido] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [mostrarCoracaoDuplo, setMostrarCoracaoDuplo] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(Number(post?.curtidas || 0));
  const ultimoToqueRef = useRef(0);

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

  function lidarComToqueImagem() {
    const agora = Date.now();
    if (agora - ultimoToqueRef.current < 320) {
      setMostrarCoracaoDuplo(true);
      setTimeout(() => setMostrarCoracaoDuplo(false), 750);
      if (!curtido) {
        clicarCurtir();
      }
    }
    ultimoToqueRef.current = agora;
  }

  function enviarComentario() {
    if (!comentarioTexto.trim()) return;
    onComentar && onComentar(post.id, comentarioTexto.trim());
    setComentarioTexto('');
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerAutor}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: avatarAutor }} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.username}>@{nomeAutor}</Text>
            <Text style={styles.locationText}>UniFil • Londrina, PR</Text>
          </View>
        </View>
        <Text style={styles.moreDots}>•••</Text>
      </View>

      <TouchableWithoutFeedback onPress={lidarComToqueImagem}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imagemUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
          {mostrarCoracaoDuplo && (
            <View style={styles.doubleTapOverlay}>
              <Text style={styles.doubleTapHeart}>♥</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.likeButton, curtido && styles.likeButtonAtivo]}
            onPress={clicarCurtir}
            activeOpacity={0.75}
          >
            <Text style={[styles.likeIcon, curtido && styles.likeIconAtivo]}>♥</Text>
            <Text style={[styles.likeCount, curtido && styles.likeCountAtivo]}>
              {totalCurtidas} {totalCurtidas === 1 ? 'curtida' : 'curtidas'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, salvo && styles.saveButtonAtivo]}
            onPress={() => setSalvo(!salvo)}
          >
            <Text style={[styles.saveText, salvo && styles.saveTextAtivo]}>
              {salvo ? '🔖 Salvo' : '📑 Salvar'}
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

        <Text style={styles.timestampText}>HÁ POUCOS MINUTOS</Text>

        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#999"
            value={comentarioTexto}
            onChangeText={setComentarioTexto}
            onSubmitEditing={enviarComentario}
            returnKeyType="send"
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
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  headerAutor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    padding: 2,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#E1306C',
    marginRight: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFEFEF',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  locationText: {
    fontSize: 11,
    color: '#8E8E8E',
    marginTop: 1,
  },
  moreDots: {
    fontSize: 12,
    color: '#8E8E8E',
    letterSpacing: 1,
  },
  imageContainer: {
    width: '100%',
    height: 420,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  doubleTapOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    width: '100%',
    height: '100%',
  },
  doubleTapHeart: {
    fontSize: 88,
    color: '#FFFFFF',
  },
  footer: {
    padding: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButtonAtivo: {
    backgroundColor: '#262626',
    borderColor: '#262626',
  },
  saveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
  },
  saveTextAtivo: {
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
    marginBottom: 8,
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
  timestampText: {
    fontSize: 10,
    color: '#8E8E8E',
    marginBottom: 10,
    letterSpacing: 0.4,
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
