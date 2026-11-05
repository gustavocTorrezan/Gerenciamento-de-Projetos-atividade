import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

export default function ProfileScreen({ usuario, posts = [] }) {
  const nomeExibicao = usuario?.nomeUsuario || 'usuario';
  const bioExibicao = usuario?.bio || 'Estudante de Ciencia da Computacao - UniFil';
  const avatarExibicao = usuario?.avatarUrl || 'https://ui-avatars.com/api/?background=0095F6&color=fff&name=' + encodeURIComponent(nomeExibicao);

  return (
    <View style={styles.container}>
      <View style={styles.headerPerfil}>
        <Image source={{ uri: avatarExibicao }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.nomeUsuario}>@{nomeExibicao}</Text>
          <Text style={styles.bio}>{bioExibicao}</Text>
          <Text style={styles.contadorPosts}>{posts.length} publicacoes</Text>
        </View>
      </View>

      {posts.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Nenhuma publicacao realizada ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => String(item?.id || index)}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.imagemUrl }} style={styles.postMiniatura} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerPerfil: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: '#DBDBDB', alignItems: 'center' },
  avatar: { width: 76, height: 76, borderRadius: 38, marginRight: 18, backgroundColor: '#EFEFEF' },
  infoContainer: { flex: 1 },
  nomeUsuario: { fontSize: 18, fontWeight: 'bold', color: '#262626', marginBottom: 4 },
  bio: { fontSize: 14, color: '#555', marginBottom: 6 },
  contadorPosts: { fontSize: 13, fontWeight: '600', color: '#262626' },
  vazioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  vazioTexto: { fontSize: 14, color: '#8E8E8E' },
  postMiniatura: { width: '33.33%', aspectRatio: 1, borderWidth: 1, borderColor: '#FFF' }
});
