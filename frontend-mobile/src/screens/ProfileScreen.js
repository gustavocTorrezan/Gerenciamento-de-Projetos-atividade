import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import PostCard from '../components/PostCard';
import { FONTS, COLORS } from '../styles/theme';

export default function ProfileScreen({
  usuario,
  ehProprioPerfil = true,
  posts = [],
  onCurtir,
  onComentar,
  onAtualizarBio,
  onVoltar,
  onEnviarMensagem
}) {
  const [postSelecionadoId, setPostSelecionadoId] = useState(null);
  const [editandoBio, setEditandoBio] = useState(false);
  const [seguindo, setSeguindo] = useState(false);
  const [bioLocal, setBioLocal] = useState(
    usuario?.bio || 'Ciência da Computação • UniFil'
  );
  const [rascunhoBio, setRascunhoBio] = useState(bioLocal);

  useEffect(() => {
    setBioLocal(usuario?.bio || 'Ciência da Computação • UniFil');
    setEditandoBio(false);
    setSeguindo(false);
  }, [usuario?.nomeUsuario, usuario?.bio]);

  const nomeExibicao = usuario?.nomeUsuario || 'usuario';
  const avatarExibicao =
    usuario?.avatarUrl ||
    'https://ui-avatars.com/api/?background=EFEFEF&color=262626&name=' +
      encodeURIComponent(nomeExibicao);

  // Calcula seguidores de forma consistente para cada usuario
  const baseSeguidores =
    nomeExibicao.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 90 + 42;
  const totalSeguidores = baseSeguidores + (seguindo ? 1 : 0);
  const totalSeguindo = (baseSeguidores % 45) + 38;

  const postModalAtual =
    postSelecionadoId !== null
      ? posts.find((p) => String(p.id) === String(postSelecionadoId)) || null
      : null;

  function salvarNovaBio() {
    const limpa = rascunhoBio.trim() || 'Ciência da Computação • UniFil';
    setBioLocal(limpa);
    setEditandoBio(false);
    if (onAtualizarBio) {
      onAtualizarBio(limpa);
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {!ehProprioPerfil && (
          <View style={styles.topVisitanteBar}>
            <TouchableOpacity style={styles.voltarBtn} onPress={onVoltar}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
              <Text style={styles.voltarTexto}>{nomeExibicao}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.headerPerfil}>
          <View style={styles.avatarStoryRing}>
            <Image source={{ uri: avatarExibicao }} style={styles.avatar} />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.topNomeRow}>
              <Text style={styles.nomeUsuario}>{nomeExibicao}</Text>

              {ehProprioPerfil ? (
                <TouchableOpacity
                  style={styles.botaoSecundario}
                  onPress={() => {
                    setRascunhoBio(bioLocal);
                    setEditandoBio(!editandoBio);
                  }}
                >
                  <Text style={styles.textoBotaoSecundario}>
                    {editandoBio ? 'Cancelar' : 'Editar perfil'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.acoesVisitanteRow}>
                  <TouchableOpacity
                    style={[styles.botaoSeguir, seguindo && styles.botaoSeguindo]}
                    onPress={() => setSeguindo(!seguindo)}
                  >
                    <Text style={[styles.textoBotaoSeguir, seguindo && styles.textoBotaoSeguindo]}>
                      {seguindo ? 'Seguindo' : 'Seguir'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.botaoSecundario}
                    onPress={() => onEnviarMensagem && onEnviarMensagem(nomeExibicao)}
                  >
                    <Text style={styles.textoBotaoSecundario}>Mensagem</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {editandoBio ? (
              <View style={styles.editarBioBox}>
                <TextInput
                  style={styles.inputBio}
                  value={rascunhoBio}
                  onChangeText={setRascunhoBio}
                  placeholder="Biografia"
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
                <Text style={styles.numeroDestaque}>{totalSeguidores}</Text> seguidores
              </Text>
              <Text style={styles.contadorPosts}>
                <Text style={styles.numeroDestaque}>{totalSeguindo}</Text> seguindo
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsDivisor}>
          <View style={styles.tabAtivaIndicador}>
            <Ionicons name="grid-outline" size={14} color={COLORS.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.tabAtivaTexto}>PUBLICAÇÕES</Text>
          </View>
        </View>

        {posts.length === 0 ? (
          <View style={styles.vazioContainer}>
            <View style={styles.cameraCircle}>
              <Ionicons name="camera-outline" size={30} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.vazioTitulo}>Nenhuma publicação ainda</Text>
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
                activeOpacity={0.85}
                onPress={() => setPostSelecionadoId(item.id)}
              >
                <Image
                  source={{ uri: item.imagemUrl }}
                  style={styles.postMiniatura}
                  resizeMode="cover"
                />
                <View style={styles.miniOverlay}>
                  <Ionicons name="heart" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.miniOverlayText}>{item.curtidas || 0}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

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
                  <Ionicons name="close" size={20} color={COLORS.textPrimary} />
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  topVisitanteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltarTexto: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  headerPerfil: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatarStoryRing: {
    padding: 2.5,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 18,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.borderLight,
  },
  infoContainer: {
    flex: 1,
  },
  topNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  nomeUsuario: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  acoesVisitanteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoSeguir: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  botaoSeguindo: {
    backgroundColor: COLORS.pillBg,
  },
  textoBotaoSeguir: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  textoBotaoSeguindo: {
    color: COLORS.textPrimary,
  },
  botaoSecundario: {
    backgroundColor: COLORS.pillBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoBotaoSecundario: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  editarBioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputBio: {
    flex: 1,
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  botaoSalvarBio: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  textoSalvarBio: {
    fontFamily: FONTS.bold,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bio: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contadorPosts: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginRight: 16,
  },
  numeroDestaque: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tabsDivisor: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  tabAtivaIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: COLORS.textPrimary,
    paddingVertical: 11,
    paddingHorizontal: 18,
    marginTop: -1,
  },
  tabAtivaTexto: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textPrimary,
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 36,
  },
  cameraCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: COLORS.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vazioTitulo: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  gridContainer: {
    padding: 1,
  },
  gridItemWrapper: {
    width: '33.33%',
    height: 175,
    padding: 1.5,
    position: 'relative',
  },
  postMiniatura: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.borderLight,
  },
  miniOverlay: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  miniOverlayText: {
    fontFamily: FONTS.bold,
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCardContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
});
