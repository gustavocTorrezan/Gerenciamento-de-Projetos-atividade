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
import { Ionicons } from '@expo/vector-icons';
import { FONTS, COLORS } from '../styles/theme';

export default function PostCard({ post, onCurtir, onComentar, onAbrirPerfil, onAbrirDirect }) {
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [curtido, setCurtido] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [mostrarCoracaoDuplo, setMostrarCoracaoDuplo] = useState(false);
  const [totalCurtidas, setTotalCurtidas] = useState(Number(post?.curtidas || 0));
  const ultimoToqueRef = useRef(0);
  const inputComentarioRef = useRef(null);

  useEffect(() => {
    setTotalCurtidas(Number(post?.curtidas || 0));
  }, [post?.curtidas]);

  const nomeAutor = post?.nomeUsuario || 'estudante.cc';
  const avatarAutor =
    post?.avatarUrl ||
    `https://ui-avatars.com/api/?background=EFEFEF&color=262626&name=${encodeURIComponent(nomeAutor)}`;
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
        <TouchableOpacity
          style={styles.headerAutor}
          activeOpacity={0.75}
          onPress={() => onAbrirPerfil && onAbrirPerfil(nomeAutor)}
        >
          <View style={styles.avatarRing}>
            <Image source={{ uri: avatarAutor }} style={styles.avatar} />
          </View>
          <View>
            <Text style={styles.username}>{nomeAutor}</Text>
            <Text style={styles.locationText}>Londrina, Paraná</Text>
          </View>
        </TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textPrimary} />
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
              <Ionicons name="heart" size={88} color="#FFFFFF" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.footer}>
        <View style={styles.actionsRow}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={clicarCurtir} activeOpacity={0.7}>
              <Ionicons
                name={curtido ? 'heart' : 'heart-outline'}
                size={25}
                color={curtido ? COLORS.danger : COLORS.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => inputComentarioRef.current && inputComentarioRef.current.focus()}
            >
              <Ionicons name="chatbubble-outline" size={23} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => onAbrirDirect && onAbrirDirect(nomeAutor)}
            >
              <Ionicons name="paper-plane-outline" size={23} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setSalvo(!salvo)}>
            <Ionicons
              name={salvo ? 'bookmark' : 'bookmark-outline'}
              size={23}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.likeCountText}>
          {totalCurtidas} {totalCurtidas === 1 ? 'curtida' : 'curtidas'}
        </Text>

        {!!post.legenda && (
          <Text style={styles.caption}>
            <Text
              style={styles.captionUser}
              onPress={() => onAbrirPerfil && onAbrirPerfil(nomeAutor)}
            >
              {nomeAutor}{' '}
            </Text>
            {post.legenda}
          </Text>
        )}

        {listaComentarios.length > 0 && (
          <View style={styles.commentsSection}>
            {listaComentarios.map((c, index) => {
              const autorCom = c.autor || c.nomeUsuario || 'usuario';
              return (
                <Text key={String(c.id || index)} style={styles.commentItem}>
                  <Text
                    style={styles.commentAuthor}
                    onPress={() => onAbrirPerfil && onAbrirPerfil(autorCom)}
                  >
                    {autorCom}{' '}
                  </Text>
                  {c.texto}
                </Text>
              );
            })}
          </View>
        )}

        <View style={styles.commentInputRow}>
          <TextInput
            ref={inputComentarioRef}
            style={styles.commentInput}
            placeholder="Adicione um comentário..."
            placeholderTextColor={COLORS.textMuted}
            value={comentarioTexto}
            onChangeText={setComentarioTexto}
            onSubmitEditing={enviarComentario}
            returnKeyType="send"
          />
          {comentarioTexto.trim().length > 0 && (
            <TouchableOpacity onPress={enviarComentario} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Publicar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 14,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 490,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerAutor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    padding: 1.5,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#DD2A7B',
    marginRight: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
  },
  username: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  locationText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  imageContainer: {
    width: '100%',
    height: 410,
    backgroundColor: COLORS.borderLight,
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
    backgroundColor: 'rgba(0,0,0,0.12)',
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: 14,
  },
  likeCountText: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 6,
  },
  captionUser: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  commentsSection: {
    marginTop: 2,
    marginBottom: 8,
  },
  commentItem: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 3,
    lineHeight: 18,
  },
  commentAuthor: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 9,
    marginTop: 4,
  },
  commentInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    paddingVertical: 4,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonText: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
