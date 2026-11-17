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
    setPosts(prev =>
      prev.map(p =>
        String(p.id) === String(postId)
          ? { ...p, curtidas: Number(p.curtidas || 0) + 1 }
          : p
      )
    );

    try {
      const postAtualizado = await curtirPostApi(postId);
      if (postAtualizado && postAtualizado.id !== undefined) {
        setPosts(prev =>
          prev.map(p => (String(p.id) === String(postAtualizado.id) ? postAtualizado : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleComentar(postId, textoComentario) {
    if (!textoComentario || !textoComentario.trim()) return;
    const textoLimpo = textoComentario.trim();

    setPosts(prev =>
      prev.map(p => {
        if (String(p.id) !== String(postId)) return p;
        const atuais = Array.isArray(p.comentarios) ? p.comentarios : [];
        return {
          ...p,
          comentarios: [...atuais, { id: Date.now(), autor: usuarioLogado.nomeUsuario, texto: textoLimpo }]
        };
      })
    );

    try {
      const postAtualizado = await comentarPostApi(postId, usuarioLogado.nomeUsuario, textoLimpo);
      if (postAtualizado && postAtualizado.id !== undefined) {
        setPosts(prev =>
          prev.map(p => (String(p.id) === String(postAtualizado.id) ? postAtualizado : p))
        );
      }
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
    <SafeAreaView style={styles.outerBackground}>
      <View style={styles.appWrapper}>
        <View style={styles.topBarContainer}>
          <Header />
          <View style={styles.topRightActions}>
            <Text style={styles.badgeUsuario}>@{usuarioLogado.nomeUsuario}</Text>
            <TouchableOpacity style={styles.botaoSair} onPress={realizarLogout}>
              <Text style={styles.textoBotaoSair}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.conteudo}>
          {abaAtiva === 'feed' && (
            <FeedScreen
              posts={posts}
              usuarioAtual={usuarioLogado.nomeUsuario}
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
              onCurtir={handleCurtir}
              onComentar={handleComentar}
              onAtualizarBio={(novaBio) =>
                setUsuarioLogado(prev => ({ ...prev, bio: novaBio }))
              }
            />
          )}
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setAbaAtiva('feed')} style={styles.tabItem}>
            <Text style={[styles.tabTexto, abaAtiva === 'feed' && styles.ativo]}>🏠 Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAbaAtiva('direct')} style={styles.tabItem}>
            <Text style={[styles.tabTexto, abaAtiva === 'direct' && styles.ativo]}>💬 Direct</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAbaAtiva('criar')} style={styles.tabItem}>
            <Text style={[styles.tabTexto, abaAtiva === 'criar' && styles.ativo]}>➕ Postar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAbaAtiva('perfil')} style={styles.tabItem}>
            <Text style={[styles.tabTexto, abaAtiva === 'perfil' && styles.ativo]}>👤 Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#ECEEF2',
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DBDBDB',
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFF',
    paddingRight: 14,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeUsuario: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginRight: 10,
  },
  botaoSair: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#ED4956',
    borderRadius: 6,
  },
  textoBotaoSair: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  conteudo: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  tabBar: {
    height: 58,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tabTexto: {
    fontSize: 14,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  ativo: {
    fontWeight: 'bold',
    color: '#0095F6',
  },
});
