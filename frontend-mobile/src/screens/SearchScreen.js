import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarUsuariosApi } from '../services/api';
import { FONTS, COLORS } from '../styles/theme';

export default function SearchScreen({ posts = [], usuarioAtual, onAbrirPerfil }) {
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    listarUsuariosApi().then((lista) => {
      if (Array.isArray(lista)) {
        setUsuarios(lista);
      }
    });
  }, []);

  const termo = busca.trim().toLowerCase();

  const usuariosFiltrados = usuarios.filter((u) => {
    if (!u || !u.nomeUsuario) return false;
    if (!termo) return true;
    const nomeMatch = u.nomeUsuario.toLowerCase().includes(termo);
    const bioMatch = (u.bio || '').toLowerCase().includes(termo);
    return nomeMatch || bioMatch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar perfis..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.secaoTitulo}>
        {termo ? 'Resultados' : 'Perfis sugeridos'}
      </Text>

      {usuariosFiltrados.length === 0 ? (
        <View style={styles.vazioBox}>
          <Text style={styles.vazioTexto}>Nenhum perfil encontrado para "{busca}".</Text>
        </View>
      ) : (
        <View style={styles.listaUsuarios}>
          {usuariosFiltrados.map((u, idx) => {
            const avatar =
              u.avatarUrl ||
              `https://ui-avatars.com/api/?background=EFEFEF&color=262626&name=${encodeURIComponent(u.nomeUsuario)}`;
            const qtdPosts = posts.filter((p) => p.nomeUsuario === u.nomeUsuario).length;
            const souEu = u.nomeUsuario === usuarioAtual;

            return (
              <TouchableOpacity
                key={String(u.id || u.nomeUsuario || idx)}
                style={styles.usuarioRow}
                activeOpacity={0.7}
                onPress={() => onAbrirPerfil && onAbrirPerfil(u.nomeUsuario)}
              >
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={styles.usuarioInfo}>
                  <View style={styles.nomeRow}>
                    <Text style={styles.username}>{u.nomeUsuario}</Text>
                    {souEu && <Text style={styles.voceTag}>(você)</Text>}
                  </View>
                  <Text style={styles.bioText} numberOfLines={1}>
                    {u.bio || 'Ciência da Computação • UniFil'}
                  </Text>
                </View>
                <Text style={styles.postsCountText}>{qtdPosts} posts</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {!termo && posts.length > 0 && (
        <>
          <Text style={[styles.secaoTitulo, { marginTop: 18 }]}>Explorar publicações</Text>
          <View style={styles.exploreGrid}>
            {posts.map((p, index) => (
              <TouchableOpacity
                key={String(p.id || index)}
                style={styles.exploreItem}
                activeOpacity={0.85}
                onPress={() => onAbrirPerfil && onAbrirPerfil(p.nomeUsuario)}
              >
                <Image
                  source={{ uri: p.imagemUrl }}
                  style={styles.exploreImg}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 14,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pillBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  secaoTitulo: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  listaUsuarios: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  usuarioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: COLORS.borderLight,
  },
  usuarioInfo: {
    flex: 1,
  },
  nomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  voceTag: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  bioText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postsCountText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  vazioBox: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  vazioTexto: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -2,
  },
  exploreItem: {
    width: '33.33%',
    height: 165,
    padding: 2,
  },
  exploreImg: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.borderLight,
  },
});
