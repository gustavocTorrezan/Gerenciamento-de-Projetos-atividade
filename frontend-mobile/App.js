import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from './src/components/Header';
import FeedScreen from './src/screens/FeedScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import DirectScreen from './src/screens/DirectScreen';
import { buscarPostsApi, criarPostApi, curtirPostApi, comentarPostApi } from './src/services/api';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('feed');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (usuarioLogado) {
      buscarPostsApi().then((dados) => {
        setPosts(Array.isArray(dados) ? dados : []);
      });
    }
  }, [usuarioLogado]);

  async function handleCurtir(postId) {
    try {
      const postAtualizado = await curtirPostApi(postId);
      setPosts(prev => prev.map(p => (p.id === postId ? postAtualizado : p)));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleComentar(postId, textoComentario) {
    if (!textoComentario || !textoComentario.trim()) return;
    try {
      const postAtualizado = await comentarPostApi(postId, usuarioLogado.nomeUsuario, textoComentario.trim());
      setPosts(prev => prev.map(p => (p.id === postId ? postAtualizado : p)));
    } catch (e) {
      console.error(e);
    }
  }

  function realizarLogout() {
    setAbaAtiva('feed');
    setUsuarioLogado(null);
  }

  if (!usuarioLogado) {
    return <LoginScreen onLoginSucesso={(u) => { setAbaAtiva('feed'); setUsuarioLogado(u); }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarContainer}>
        <Header />
        <TouchableOpacity style={styles.botaoSair} onPress={realizarLogout}>
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.conteudo}>
        {abaAtiva === 'feed' && (
          <FeedScreen
            posts={posts}
            onCurtir={handleCurtir}
            onComentar={handleComentar}
          />
        )}
        {abaAtiva === 'direct' && <DirectScreen usuarioAtual={usuarioLogado.nomeUsuario} />}
        {abaAtiva === 'criar' && (
          <CreatePostScreen
            onPublicar={async (img, leg) => {
              if (!img || !img.trim()) return;
              const novo = await criarPostApi({
                nomeUsuario: usuarioLogado.nomeUsuario,
                imagemUrl: img.trim(),
                legenda: (leg || '').trim()
              });
              setPosts([novo, ...posts]);
              setAbaAtiva('feed');
            }}
          />
        )}
        {abaAtiva === 'perfil' && (
          <ProfileScreen
            usuario={usuarioLogado}
            posts={posts.filter(p => p.nomeUsuario === usuarioLogado.nomeUsuario)}
          />
        )}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setAbaAtiva('feed')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'feed' && styles.ativo]}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('direct')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'direct' && styles.ativo]}>Direct</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('criar')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'criar' && styles.ativo]}>+ Postar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('perfil')} style={styles.tabItem}>
          <Text style={[styles.tabTexto, abaAtiva === 'perfil' && styles.ativo]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBarContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DBDBDB', backgroundColor: '#FFF' },
  botaoSair: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#ED4956', borderRadius: 4, marginRight: 15 },
  textoBotaoSair: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  conteudo: { flex: 1 },
  tabBar: { height: 55, borderTopWidth: 1, borderTopColor: '#DBDBDB', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF' },
  tabItem: { padding: 10 },
  tabTexto: { fontSize: 14, color: '#8E8E8E' },
  ativo: { fontWeight: 'bold', color: '#0095F6' },
});
