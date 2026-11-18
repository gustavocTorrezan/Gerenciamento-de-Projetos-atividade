import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/StoriesBar';
import { buscarPostsPaginadosApi } from '../services/api';
import { COLORS } from '../styles/theme';

export default function FeedScreen({
  posts = [],
  onCurtir,
  onComentar,
  usuarioAtual = 'estudante.cc',
  onAbrirPerfil,
  onAbrirDirect
}) {
  const [postsExtras, setPostsExtras] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const listaCompleta = [...posts, ...postsExtras];

  function handleCurtirLocal(postId, novoTotal, curtidoAgora = true) {
    setPostsExtras(prev =>
      prev.map(p => {
        if (String(p.id) !== String(postId)) return p;
        const atual = Number(p.curtidas ?? p.likes ?? 0);
        const atualizado = typeof novoTotal === 'number'
          ? novoTotal
          : (curtidoAgora ? atual + 1 : Math.max(0, atual - 1));
        return { ...p, curtidas: atualizado, likes: atualizado, curtidoPeloUsuario: curtidoAgora };
      })
    );
    if (onCurtir) {
      onCurtir(postId, novoTotal, curtidoAgora);
    }
  }

  function handleComentarLocal(postId, texto) {
    setPostsExtras(prev =>
      prev.map(p => {
        if (String(p.id) !== String(postId)) return p;
        const comentariosAtuais = Array.isArray(p.comentarios) ? p.comentarios : [];
        return {
          ...p,
          comentarios: [...comentariosAtuais, { id: Date.now(), autor: usuarioAtual, texto }]
        };
      })
    );
    if (onComentar) {
      onComentar(postId, texto);
    }
  }

  async function carregarMaisPosts() {
    if (carregandoMais || posts.length === 0) return;
    setCarregandoMais(true);
    try {
      const proximaPagina = pagina + 1;
      const novos = await buscarPostsPaginadosApi(proximaPagina, 2);
      const lote = (Array.isArray(novos) && novos.length > 0 ? novos : posts.slice(0, 2)).map(
        (item, idx) => ({
          ...item,
          id: `${item.id}-page-${proximaPagina}-${idx}`,
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
        ListHeaderComponent={
          <StoriesBar usuarioAtual={usuarioAtual} onAbrirPerfil={onAbrirPerfil} />
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onCurtir={handleCurtirLocal}
            onComentar={handleComentarLocal}
            onAbrirPerfil={onAbrirPerfil}
            onAbrirDirect={onAbrirDirect}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={carregarMaisPosts}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <View style={styles.footerLoader}>
            {carregandoMais && <ActivityIndicator size="small" color={COLORS.textMuted} />}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 16,
    width: '100%',
    alignSelf: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
