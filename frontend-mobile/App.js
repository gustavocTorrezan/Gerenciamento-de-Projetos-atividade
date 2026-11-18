import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from './src/components/Header';
import FeedScreen from './src/screens/FeedScreen';
import SearchScreen from './src/screens/SearchScreen';
import CreatePostScreen from './src/screens/CreatePostScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import DirectScreen from './src/screens/DirectScreen';
import {
  buscarPostsApi,
  criarPostApi,
  curtirPostApi,
  comentarPostApi,
  listarUsuariosApi
} from './src/services/api';
import { FONTS, COLORS } from './src/styles/theme';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);
  const [perfilVisitado, setPerfilVisitado] = useState(null);
  const [directDestinatario, setDirectDestinatario] = useState(null);

  // Carrega a fonte Plus Jakarta Sans na Web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const idLink = 'instacc-google-fonts';
      if (!document.getElementById(idLink)) {
        const link = document.createElement('link');
        link.id = idLink;
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    if (usuarioLogado) {
      buscarPostsApi().then((dados) => {
        setPosts(Array.isArray(dados) ? dados : []);
      });
      listarUsuariosApi().then((lista) => {
        if (Array.isArray(lista)) setUsuariosCadastrados(lista);
      });
    }
  }, [usuarioLogado]);

  async function handleCurtir(postId, novoTotal, curtidoAgora = true) {
    const idBase = String(postId).split('-page-')[0];

    setPosts(prev =>
      prev.map(p => {
        if (String(p.id) !== idBase && String(p.id) !== String(postId)) return p;
        const atual = Number(p.curtidas ?? p.likes ?? 0);
        const atualizado = typeof novoTotal === 'number'
          ? novoTotal
          : (curtidoAgora ? atual + 1 : Math.max(0, atual - 1));
        return {
          ...p,
          curtidas: atualizado,
          likes: atualizado,
          curtidoPeloUsuario: curtidoAgora,
        };
      })
    );

    try {
      await curtirPostApi(idBase, curtidoAgora);
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

  function abrirPerfilDeUsuario(nomeUsuario) {
    if (!nomeUsuario) return;
    if (nomeUsuario === usuarioLogado.nomeUsuario) {
      setPerfilVisitado(null);
      setAbaAtiva('perfil');
      return;
    }
    const encontrado = usuariosCadastrados.find(
      u => u.nomeUsuario.toLowerCase() === nomeUsuario.toLowerCase()
    );
    setPerfilVisitado(
      encontrado || {
        nomeUsuario,
        bio: 'Ciência da Computação • UniFil'
      }
    );
    setAbaAtiva('perfil');
  }

  function abrirConversaDirect(nomeUsuario) {
    setDirectDestinatario(nomeUsuario);
    setAbaAtiva('direct');
  }

  function realizarLogout() {
    setAbaAtiva('feed');
    setPerfilVisitado(null);
    setDirectDestinatario(null);
    setUsuarioLogado(null);
  }

  if (!usuarioLogado) {
    return (
      <LoginScreen
        onLoginSucesso={(u) => {
          setAbaAtiva('feed');
          setPerfilVisitado(null);
          setUsuarioLogado(u);
        }}
      />
    );
  }

  const usuarioExibidoNoPerfil = perfilVisitado || usuarioLogado;
  const ehMeuPerfil = usuarioExibidoNoPerfil.nomeUsuario === usuarioLogado.nomeUsuario;

  return (
    <SafeAreaView style={styles.outerBackground}>
      <View style={styles.appWrapper}>
        <View style={styles.topBarContainer}>
          <Header />
          <View style={styles.topRightActions}>
            <TouchableOpacity onPress={() => abrirPerfilDeUsuario(usuarioLogado.nomeUsuario)}>
              <Text style={styles.badgeUsuario}>@{usuarioLogado.nomeUsuario}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSair} onPress={realizarLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.textPrimary} />
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
              onAbrirPerfil={abrirPerfilDeUsuario}
              onAbrirDirect={abrirConversaDirect}
            />
          )}

          {abaAtiva === 'pesquisar' && (
            <SearchScreen
              posts={posts}
              usuarioAtual={usuarioLogado.nomeUsuario}
              onAbrirPerfil={abrirPerfilDeUsuario}
            />
          )}

          {abaAtiva === 'direct' && (
            <DirectScreen
              usuarioAtual={usuarioLogado.nomeUsuario}
              destinatarioInicial={directDestinatario}
            />
          )}

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
              usuario={usuarioExibidoNoPerfil}
              ehProprioPerfil={ehMeuPerfil}
              posts={posts.filter(p => p.nomeUsuario === usuarioExibidoNoPerfil.nomeUsuario)}
              onCurtir={handleCurtir}
              onComentar={handleComentar}
              onVoltar={() => {
                setPerfilVisitado(null);
                setAbaAtiva('pesquisar');
              }}
              onEnviarMensagem={abrirConversaDirect}
              onAtualizarBio={(novaBio) =>
                setUsuarioLogado(prev => ({ ...prev, bio: novaBio }))
              }
            />
          )}
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => {
              setPerfilVisitado(null);
              setAbaAtiva('feed');
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={abaAtiva === 'feed' ? 'home' : 'home-outline'}
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPerfilVisitado(null);
              setAbaAtiva('pesquisar');
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={abaAtiva === 'pesquisar' ? 'search' : 'search-outline'}
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPerfilVisitado(null);
              setAbaAtiva('criar');
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={abaAtiva === 'criar' ? 'add-circle' : 'add-circle-outline'}
              size={26}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPerfilVisitado(null);
              setAbaAtiva('direct');
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={abaAtiva === 'direct' ? 'paper-plane' : 'paper-plane-outline'}
              size={23}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPerfilVisitado(null);
              setAbaAtiva('perfil');
            }}
            style={styles.tabItem}
          >
            <Ionicons
              name={abaAtiva === 'perfil' && ehMeuPerfil ? 'person-circle' : 'person-circle-outline'}
              size={26}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingRight: 14,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeUsuario: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginRight: 12,
  },
  botaoSair: {
    padding: 4,
  },
  conteudo: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    height: 52,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
