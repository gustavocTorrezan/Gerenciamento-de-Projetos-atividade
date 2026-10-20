import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      <View style={styles.cabecalhoUsuario}>
        <Image
          source={{ uri: post.fotoPerfilUsuarioUrl }}
          style={styles.avatar}
        />
        <Text style={styles.nomeUsuario}>{post.nomeUsuario}</Text>
      </View>

      <Image
        source={{ uri: post.imagemUrl }}
        style={styles.imagemPost}
        resizeMode="cover"
      />

      <View style={styles.rodape}>
        <Text style={styles.curtidas}>
          {post.quantidadeCurtidas} curtidas
        </Text>
        <Text style={styles.legenda}>
          <Text style={styles.nomeUsuarioLegenda}>{post.nomeUsuario} </Text>
          {post.legenda}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  cabecalhoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#262626',
  },
  imagemPost: {
    width: '100%',
    height: 320,
    backgroundColor: '#F0F0F0',
  },
  rodape: {
    padding: 12,
  },
  curtidas: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#262626',
  },
  legenda: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
  },
  nomeUsuarioLegenda: {
    fontWeight: 'bold',
  },
});
