import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarStoriesApi, criarStoryApi } from '../services/api';
import { FONTS, COLORS } from '../styles/theme';

export default function StoriesBar({ usuarioAtual = 'estudante.cc', onAbrirPerfil }) {
  const [stories, setStories] = useState([]);
  const [storyAtivo, setStoryAtivo] = useState(null);
  const [modalCriar, setModalCriar] = useState(false);
  const [novaUrl, setNovaUrl] = useState('');
  const [novaLegenda, setNovaLegenda] = useState('');
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    buscarStoriesApi().then(lista => {
      if (Array.isArray(lista)) setStories(lista);
    });
  }, []);

  useEffect(() => {
    if (!storyAtivo) {
      setProgresso(0);
      return;
    }
    setProgresso(0);
    const timer = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setStoryAtivo(null);
          return 100;
        }
        return prev + 4;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [storyAtivo]);

  async function publicarStory() {
    if (!novaUrl.trim()) return;
    const criado = await criarStoryApi(usuarioAtual, novaUrl.trim(), novaLegenda.trim());
    setStories(prev => [criado, ...prev]);
    setNovaUrl('');
    setNovaLegenda('');
    setModalCriar(false);
    setStoryAtivo(criado);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.storyItem} onPress={() => setModalCriar(true)}>
          <View style={[styles.anelStory, styles.anelNovo]}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?background=EFEFEF&color=262626&name=${encodeURIComponent(usuarioAtual)}`
              }}
              style={styles.avatar}
            />
            <View style={styles.badgeMais}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.nomeStory} numberOfLines={1}>Seu story</Text>
        </TouchableOpacity>

        {stories.map((st, idx) => (
          <TouchableOpacity
            key={String(st.id || idx)}
            style={styles.storyItem}
            onPress={() => setStoryAtivo(st)}
          >
            <View style={styles.anelStory}>
              <Image
                source={{
                  uri: st.avatarUrl || `https://ui-avatars.com/api/?background=E1306C&color=fff&name=${encodeURIComponent(st.nomeUsuario)}`
                }}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.nomeStory} numberOfLines={1}>
              {st.nomeUsuario}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!storyAtivo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {storyAtivo && (
            <View style={styles.storyViewerCard}>
              <View style={styles.barraProgressoFundo}>
                <View style={[styles.barraProgressoAtiva, { width: `${progresso}%` }]} />
              </View>

              <View style={styles.storyHeader}>
                <TouchableOpacity
                  style={styles.storyAutorInfo}
                  onPress={() => {
                    const user = storyAtivo.nomeUsuario;
                    setStoryAtivo(null);
                    onAbrirPerfil && onAbrirPerfil(user);
                  }}
                >
                  <Image
                    source={{
                      uri: storyAtivo.avatarUrl || `https://ui-avatars.com/api/?background=E1306C&color=fff&name=${encodeURIComponent(storyAtivo.nomeUsuario)}`
                    }}
                    style={styles.avatarPequeno}
                  />
                  <Text style={styles.storyAutorNome}>{storyAtivo.nomeUsuario}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStoryAtivo(null)} style={styles.botaoFechar}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: storyAtivo.imagemUrl }}
                style={styles.storyImagemPrincipal}
                resizeMode="cover"
              />

              {!!storyAtivo.legenda && (
                <View style={styles.legendaOverlay}>
                  <Text style={styles.textoLegendaStory}>{storyAtivo.legenda}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>

      <Modal visible={modalCriar} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cardCriarStory}>
            <View style={styles.modalCriarHeader}>
              <Text style={styles.tituloCriar}>Novo story</Text>
              <TouchableOpacity onPress={() => setModalCriar(false)}>
                <Ionicons name="close" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="URL da imagem"
              placeholderTextColor={COLORS.textMuted}
              value={novaUrl}
              onChangeText={setNovaUrl}
            />
            <TextInput
              style={styles.input}
              placeholder="Legenda (opcional)"
              placeholderTextColor={COLORS.textMuted}
              value={novaLegenda}
              onChangeText={setNovaLegenda}
            />
            <TouchableOpacity style={styles.botaoPublicar} onPress={publicarStory}>
              <Text style={styles.textoPublicar}>Compartilhar no story</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  anelStory: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#DD2A7B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  anelNovo: {
    borderColor: COLORS.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.borderLight,
  },
  badgeMais: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomeStory: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  storyViewerCard: {
    width: '100%',
    maxWidth: 390,
    height: 580,
    backgroundColor: '#121212',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  barraProgressoFundo: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.28)',
    width: '100%',
  },
  barraProgressoAtiva: {
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  storyAutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPequeno: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  storyAutorNome: {
    fontFamily: FONTS.bold,
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  botaoFechar: {
    padding: 4,
  },
  storyImagemPrincipal: {
    width: '100%',
    height: 445,
    backgroundColor: '#1E1E1E',
  },
  legendaOverlay: {
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  textoLegendaStory: {
    fontFamily: FONTS.regular,
    color: '#FFF',
    fontSize: 13,
    textAlign: 'center',
  },
  cardCriarStory: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
  },
  modalCriarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloCriar: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  input: {
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  botaoPublicar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoPublicar: {
    fontFamily: FONTS.bold,
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
