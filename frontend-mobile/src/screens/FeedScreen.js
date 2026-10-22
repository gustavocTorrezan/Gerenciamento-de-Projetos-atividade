import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';

export default function FeedScreen() {
  const [posts] = useState([
    {
      id: 1,
      nomeUsuario: 'estudante.cc',
      fotoPerfilUsuarioUrl: 'https://i.ibb.co/b5jnXG2X/Whats-App-Image-2026-10-22-at-15-53-04-1.jpg',
      imagemUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      legenda: 'Layout base do Feed pronto na Semana 2!',
      quantidadeCurtidas: 10,
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
});
