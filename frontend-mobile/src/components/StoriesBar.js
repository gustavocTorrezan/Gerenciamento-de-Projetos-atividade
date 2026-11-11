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
import { buscarStoriesApi, criarStoryApi } from '../services/api';

export default function StoriesBar({ usuarioAtual = 'estudante.cc' }) {
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
                uri: `https://ui-avatars.com/api/?background=0095F6&color=fff&name=${encodeURIComponent(usuarioAtual)}`
              }}
              style={styles.avatar}
            />
            <View style={styles.badgeMais}>
              <Text style={styles.textoMais}>+</Text>
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

      {/* Modal Visualizador de Story */}
      <Modal visible={!!storyAtivo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {storyAtivo && (
            <View style={styles.storyViewerCard}>
              <View style={styles.barraProgressoFundo}>
                <View style={[styles.barraProgressoAtiva, { width: `${progresso}%` }]} />
              </View>

              <View style={styles.storyHeader}>
                <View style={styles.storyAutorInfo}>
                  <Image
                    source={{
                      uri: storyAtivo.avatarUrl || `https://ui-avatars.com/api/?background=E1306C&color=fff&name=${encodeURIComponent(storyAtivo.nomeUsuario)}`
                    }}
                    style={styles.avatarPequeno}
                  />
                  <Text style={styles.storyAutorNome}>@{storyAtivo.nomeUsuario}</Text>
                </View>
                <TouchableOpacity onPress={() => setStoryAtivo(null)} style={styles.botaoFechar}>
                  <Text style={styles.textoFechar}>✕</Text>
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

      {/* Modal Criar Novo Story */}
      <Modal visible={modalCriar} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.cardCriarStory}>
            <Text style={styles.tituloCriar}>Publicar novo Story</Text>
            <TextInput
              style={styles.input}
              placeholder="Cole a URL da imagem do Story..."
              value={novaUrl}
              onChangeText={setNovaUrl}
            />
            <TextInput
              style={styles.input}
              placeholder="Legenda rápida (opcional)..."
              value={novaLegenda}
              onChangeText={setNovaLegenda}
            />
            <View style={styles.botoesCriarRow}>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setModalCriar(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoPublicar]}
                onPress={publicarStory}
              >
                <Text style={styles.textoPublicar}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 10,
  },
  scrollContent: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  anelStory: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#E1306C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  anelNovo: {
    borderColor: '#0095F6',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F0F0F0',
  },
  badgeMais: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0095F6',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoMais: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  nomeStory: {
    fontSize: 11,
    color: '#262626',
    fontWeight: '500',
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
    maxWidth: 400,
    height: 580,
    backgroundColor: '#121212',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  barraProgressoFundo: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: '100%',
  },
  barraProgressoAtiva: {
    height: 4,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  storyAutorNome: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoFechar: {
    padding: 6,
  },
  textoFechar: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  storyImagemPrincipal: {
    width: '100%',
    height: 440,
    backgroundColor: '#1E1E1E',
  },
  legendaOverlay: {
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  textoLegendaStory: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  cardCriarStory: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 20,
  },
  tituloCriar: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  botoesCriarRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  botaoModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  botaoCancelar: {
    backgroundColor: '#EFEFEF',
  },
  botaoPublicar: {
    backgroundColor: '#0095F6',
  },
  textoCancelar: {
    color: '#262626',
    fontWeight: '600',
  },
  textoPublicar: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
