import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/StoriesBar';
import { buscarPostsPaginadosApi } from '../services/api';

export default function FeedScreen({ posts = [], onCurtir, onComentar, usuarioAtual = 'estudante.cc' }) {
  const [postsExtras, setPostsExtras] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const listaCompleta = [...posts, ...postsExtras];

  async function carregarMaisPosts() {
    if (carregandoMais || posts.length === 0) return;
    setCarregandoMais(true);
    try {
      const proximaPagina = pagina + 1;
      const novos = await buscarPostsPaginadosApi(proximaPagina, 2);
      const lote = (Array.isArray(novos) && novos.length > 0 ? novos : posts.slice(0, 2)).map(
        (item, idx) => ({
          ...item,
          keyUnica: `${item.id}-page-${proximaPagina}-${idx}`,
        })
      );
      setPostsExtras(prev => [...prev, ...lote]);
      setPagina(proximaPagina);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregandoMais(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listaCompleta}
        keyExtractor={(item, index) => String(item.keyUnica || item.id || index)}
        ListHeaderComponent={<StoriesBar usuarioAtual={usuarioAtual} />}
        renderItem={({ item }) => (
          <PostCard post={item} onCurtir={onCurtir} onComentar={onComentar} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={carregarMaisPosts}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <View style={styles.footerLoader}>
            {carregandoMais ? (
              <>
                <ActivityIndicator size="small" color="#0095F6" />
                <Text style={styles.loaderText}>Carregando mais publicações...</Text>
              </>
            ) : (
              <Text style={styles.loaderHint}>Role para baixo para ver mais posts ↓</Text>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 6,
    fontSize: 12,
    color: '#0095F6',
    fontWeight: '600',
  },
  loaderHint: {
    fontSize: 12,
    color: '#999',
  },
});
