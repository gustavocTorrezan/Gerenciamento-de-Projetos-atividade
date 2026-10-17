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
});
