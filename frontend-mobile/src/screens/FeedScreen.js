import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FeedScreen() {
  const [posts] = useState([
    {
      id: 1,
      nomeUsuario: 'estudante.cc',
      fotoPerfilUsuarioUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      imagemUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      legenda: 'Layout base do Feed pronto na Semana 2!',
      quantidadeCurtidas: 10,
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.statusTexto}>
        Total de publicações carregadas: {posts.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTexto: {
    fontSize: 14,
    color: '#262626',
  },
});
