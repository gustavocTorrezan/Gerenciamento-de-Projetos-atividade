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
      buscarPostsApi().then(setPosts);
    }
  }, [usuarioLogado]);

  if (!usuarioLogado) {
    return <LoginScreen onLoginSucesso={setUsuarioLogado} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.conteudo}>
        {abaAtiva === 'feed' && <FeedScreen posts={posts} onCurtir={()=>{}} onComentar={()=>{}} />}
        {abaAtiva === 'direct' && <DirectScreen usuarioAtual={usuarioLogado.nomeUsuario} />}
        {abaAtiva === 'criar' && <CreatePostScreen onPublicar={async (img, leg)=>{
          const novo = await criarPostApi({ nomeUsuario: usuarioLogado.nomeUsuario, imagemUrl: img, legenda: leg });
          setPosts([novo, ...posts]);
          setAbaAtiva('feed');
        }} />}
        {abaAtiva === 'perfil' && <ProfileScreen usuario={usuarioLogado} posts={posts.filter(p => p.nomeUsuario === usuarioLogado.nomeUsuario)} />}
      </View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setAbaAtiva('feed')}><Text style={abaAtiva === 'feed' && styles.ativo}>Feed</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('direct')}><Text style={abaAtiva === 'direct' && styles.ativo}>Direct</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('criar')}><Text style={abaAtiva === 'criar' && styles.ativo}>+ Postar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setAbaAtiva('perfil')}><Text style={abaAtiva === 'perfil' && styles.ativo}>Perfil</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  conteudo: { flex: 1 },
  tabBar: { height: 55, borderTopWidth: 1, borderTopColor: '#DBDBDB', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFFFFF' },
  ativo: { fontWeight: 'bold', color: '#0095F6' },
});
