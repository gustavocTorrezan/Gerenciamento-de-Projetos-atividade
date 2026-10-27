import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

export default function ProfileScreen({ posts = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerPerfil}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
          style={styles.avatarGrande}
        />
        <View style={styles.infoUsuario}>
          <Text style={styles.nomeUsuario}>estudante.cc</Text>
          <Text style={styles.nomeCompleto}>Estudante de Computacao</Text>
          <Text style={styles.bio}>1o Ano de Ciencia da Computacao | Java & React Native</Text>
          <Text style={styles.contador}>{posts.length} publicacoes</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.imagemUrl }} style={styles.miniatura} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerPerfil: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#DBDBDB', alignItems: 'center' },
  avatarGrande: { width: 80, height: 80, borderRadius: 40, marginRight: 20 },
  infoUsuario: { flex: 1 },
  nomeUsuario: { fontSize: 18, fontWeight: 'bold', color: '#262626' },
  nomeCompleto: { fontSize: 14, fontWeight: '600', color: '#262626', marginTop: 2 },
  bio: { fontSize: 13, color: '#666666', marginTop: 4 },
  contador: { fontSize: 13, fontWeight: 'bold', color: '#262626', marginTop: 8 },
  miniatura: { flex: 1 / 3, aspectRatio: 1, margin: 1, backgroundColor: '#EFEFEF' },
});
