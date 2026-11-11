import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

export default function ProfileScreen({ usuario, posts = [] }) {
  const nomeExibicao = usuario?.nomeUsuario || 'usuario';
  const bioExibicao = usuario?.bio || 'Estudante de Ciência da Computação - UniFil 💻';
  const avatarExibicao =
    usuario?.avatarUrl ||
    'https://ui-avatars.com/api/?background=0095F6&color=fff&name=' + encodeURIComponent(nomeExibicao);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.headerPerfil}>
          <Image source={{ uri: avatarExibicao }} style={styles.avatar} />
          <View style={styles.infoContainer}>
            <Text style={styles.nomeUsuario}>@{nomeExibicao}</Text>
            <Text style={styles.bio}>{bioExibicao}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.contadorPosts}>
                <Text style={styles.numeroDestaque}>{posts.length}</Text> publicações
              </Text>
              <Text style={styles.contadorPosts}>
                <Text style={styles.numeroDestaque}>148</Text> seguidores
              </Text>
              <Text style={styles.contadorPosts}>
                <Text style={styles.numeroDestaque}>112</Text> seguindo
              </Text>
            </View>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhuma publicação realizada ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item, index) => String(item?.id || index)}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <View style={styles.gridItemWrapper}>
                <Image
                  source={{ uri: item.imagemUrl }}
                  style={styles.postMiniatura}
                  resizeMode="cover"
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#FFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#EAEAEA',
  },
  headerPerfil: {
    flexDirection: 'row',
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginRight: 20,
    backgroundColor: '#EFEFEF',
    borderWidth: 2,
    borderColor: '#E1306C',
  },
  infoContainer: {
    flex: 1,
  },
  nomeUsuario: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
  },
  bio: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contadorPosts: {
    fontSize: 13,
    color: '#555',
    marginRight: 16,
  },
  numeroDestaque: {
    fontWeight: 'bold',
    color: '#262626',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  vazioTexto: {
    fontSize: 14,
    color: '#8E8E8E',
  },
  gridContainer: {
    padding: 6,
  },
  gridItemWrapper: {
    width: '33.33%',
    height: 175,
    padding: 4,
  },
  postMiniatura: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#EFEFEF',
  },
});
