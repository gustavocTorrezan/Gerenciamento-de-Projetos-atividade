import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet
} from 'react-native';
import PostCard from '../components/PostCard';

export default function ProfileScreen({
  usuario,
  posts = [],
  onCurtir,
  onComentar,
  onAtualizarBio
}) {
  const [postSelecionadoId, setPostSelecionadoId] = useState(null);
  const [editandoBio, setEditandoBio] = useState(false);
  const [bioLocal, setBioLocal] = useState(
    usuario?.bio || 'Estudante de Ciência da Computação - UniFil 💻'
  );
  const [rascunhoBio, setRascunhoBio] = useState(bioLocal);

  const nomeExibicao = usuario?.nomeUsuario || 'usuario';
  const avatarExibicao =
    usuario?.avatarUrl ||
    'https://ui-avatars.com/api/?background=0095F6&color=fff&name=' +
      encodeURIComponent(nomeExibicao);

  const postModalAtual =
    postSelecionadoId !== null
      ? posts.find((p) => String(p.id) === String(postSelecionadoId)) || null
      : null;

  function salvarNovaBio() {
    const limpa = rascunhoBio.trim() || 'Estudante de Ciência da Computação - UniFil 💻';
    setBioLocal(limpa);
    setEditandoBio(false);
    if (onAtualizarBio) {
      onAtualizarBio(limpa);
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.headerPerfil}>
          <View style={styles.avatarStoryRing}>
            <Image source={{ uri: avatarExibicao }} style={styles.avatar} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.topNomeRow}>
              <Text style={styles.nomeUsuario}>@{nomeExibicao}</Text>
              <TouchableOpacity
                style={styles.botaoEditarPerfil}
                onPress={() => {
                  setRascunhoBio(bioLocal);
                  setEditandoBio(!editandoBio);
                }}
              >
                <Text style={styles.textoEditarPerfil}>
                  {editandoBio ? 'Cancelar' : 'Editar bio'}
                </Text>
              </TouchableOpacity>
            </View>

            {editandoBio ? (
              <View style={styles.editarBioBox}>
                <TextInput
                  style={styles.inputBio}
                  value={rascunhoBio}
                  onChangeText={setRascunhoBio}
                  placeholder="Escreva sua bio..."
                  maxLength={120}
                />
                <TouchableOpacity style={styles.botaoSalvarBio} onPress={salvarNovaBio}>
                  <Text style={styles.textoSalvarBio}>Salvar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.bio}>{bioLocal}</Text>
            )}

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

        {/* Barra de aba estilo Instagram */}
        <View style={styles.tabsDivisor}>
          <View style={styles.tabAtivaIndicador}>
            <Text style={styles.tabAtivaTexto}>⊞ PUBLICAÇÕES</Text>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioIcon}>📷</Text>
            <Text style={styles.vazioTitulo}>Ainda não há publicações</Text>
            <Text style={styles.vazioTexto}>
              Quando você compartilhar fotos, elas aparecerão aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item, index) => String(item?.id || index)}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gridItemWrapper}
                activeOpacity={0.8}
                onPress={() => setPostSelecionadoId(item.id)}
              >
                <Image
                  source={{ uri: item.imagemUrl }}
                  style={styles.postMiniatura}
                  resizeMode="cover"
                />
                <View style={styles.miniOverlay}>
                  <Text style={styles.miniOverlayText}>♥ {item.curtidas || 0}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Modal para visualizar o post selecionado */}
        <Modal
          visible={!!postModalAtual}
          transparent
          animationType="fade"
          onRequestClose={() => setPostSelecionadoId(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCardContainer}>
              <View style={styles.modalTopBar}>
                <Text style={styles.modalTitle}>Publicação</Text>
                <TouchableOpacity
                  onPress={() => setPostSelecionadoId(null)}
                  style={styles.modalCloseBtn}
                >
                  <Text style={styles.modalCloseText}>✕ Fechar</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {postModalAtual && (
                  <PostCard
                    post={postModalAtual}
                    onCurtir={onCurtir}
                    onComentar={onComentar}
                  />
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    padding: 20,
    alignItems: 'center',
  },
  avatarStoryRing: {
    padding: 3,
    borderRadius: 46,
    borderWidth: 2,
    borderColor: '#E1306C',
    marginRight: 18,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFEFEF',
  },
  infoContainer: {
    flex: 1,
  },
  topNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nomeUsuario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  botaoEditarPerfil: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textoEditarPerfil: {
    fontSize: 12,
    fontWeight: '600',
    color: '#262626',
  },
  editarBioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputBio: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#262626',
  },
  botaoSalvarBio: {
    marginLeft: 8,
    backgroundColor: '#0095F6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  textoSalvarBio: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 13,
    color: '#444',
    marginBottom: 10,
    lineHeight: 18,
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
  tabsDivisor: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
  },
  tabAtivaIndicador: {
    borderTopWidth: 2,
    borderTopColor: '#262626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: -1,
  },
  tabAtivaTexto: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#262626',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  vazioIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
  vazioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
  },
  vazioTexto: {
    fontSize: 13,
    color: '#8E8E8E',
    textAlign: 'center',
  },
  gridContainer: {
    padding: 4,
  },
  gridItemWrapper: {
    width: '33.33%',
    height: 175,
    padding: 3,
    position: 'relative',
  },
  postMiniatura: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
  },
  miniOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniOverlayText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCardContainer: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: '#F6F7F9',
    borderRadius: 14,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#262626',
  },
  modalCloseBtn: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#262626',
  },
});
