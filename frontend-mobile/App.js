import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from './src/components/Header';
import FeedScreen from './src/screens/FeedScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { buscarPostsApi, criarPostApi, curtirPostApi, comentarPostApi } from './src/services/api';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('feed');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function carregar() {
      const dados = await buscarPostsApi();
      setPosts(dados);
    }
    carregar();
  }, []);

  async function handleAdicionarPost(imagemUrl, legenda) {
    const novo = await criarPostApi({ nomeUsuario: 'estudante.cc', imagemUrl, legenda });
    setPosts([novo, ...posts]);
    setAbaAtiva('feed');
  }

  async function handleCurtir(postId) {
    await curtirPostApi(postId);
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const curtido = !p.curtidoPeloUsuarioAtual;
        return {
          ...p,
          curtidoPeloUsuarioAtual: curtido,
          quantidadeCurtidas: curtido ? p.quantidadeCurtidas + 1 : Math.max(0, p.quantidadeCurtidas - 1)
        };
      }
      return p;
    }));
  }

  async function handleComentar(postId, texto) {
    if (!texto.trim()) return;
    await comentarPostApi(postId, texto);
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const comentariosAtuais = p.comentarios || [];
        return {
          ...p,
          comentarios: [...comentariosAtuais, { id: Date.now(), nomeUsuario: 'estudante.cc', texto }]
        };
      }
      return p;
    }));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.conteudo}>
        {abaAtiva === 'feed' && <FeedScreen posts={posts} onCurtir={handleCurtir} onComentar={handleComentar} />}
        {abaAtiva === 'criar' && <CreatePostScreen onPublicar={handleAdicionarPost} />}
        {abaAtiva === 'perfil' && <ProfileScreen posts={posts.filter(p => p.nomeUsuario === 'estudante.cc')} />}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setAbaAtiva('feed')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'feed' && styles.tabAtiva]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('criar')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'criar' && styles.tabAtiva]}>+ Postar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('perfil')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'perfil' && styles.tabAtiva]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  conteudo: { flex: 1 },
  tabBar: { height: 55, borderTopWidth: 1, borderTopColor: '#DBDBDB', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF' },
  tabItem: { padding: 10 },
  tabTexto: { fontSize: 15, color: '#8E8E8E' },
  tabAtiva: { fontWeight: 'bold', color: '#262626' },
});
