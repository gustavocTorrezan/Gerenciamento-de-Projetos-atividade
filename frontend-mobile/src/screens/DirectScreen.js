import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarUsuariosApi, buscarMensagensApi, enviarMensagemApi } from '../services/api';
import { FONTS, COLORS } from '../styles/theme';

export default function DirectScreen({ usuarioAtual, destinatarioInicial = null }) {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState(destinatarioInicial);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [erroEnvio, setErroEnvio] = useState('');

  useEffect(() => {
    if (destinatarioInicial) {
      setDestinatario(destinatarioInicial);
    }
  }, [destinatarioInicial]);

  useEffect(() => {
    listarUsuariosApi().then(lista => {
      const outros = (lista || []).filter(u => u && u.nomeUsuario && u.nomeUsuario !== usuarioAtual);
      setUsuarios(outros);
      if (!destinatarioInicial && outros.length > 0) {
        setDestinatario(prev => prev || outros[0].nomeUsuario);
      }
    });
  }, [usuarioAtual, destinatarioInicial]);

  useEffect(() => {
    if (!destinatario) return;
    setMensagens([]);

    async function carregarMensagens() {
      const msgs = await buscarMensagensApi(usuarioAtual, destinatario);
      if (Array.isArray(msgs)) {
        setMensagens(msgs);
      }
    }

    carregarMensagens();
    const interval = setInterval(carregarMensagens, 2000);
    return () => clearInterval(interval);
  }, [usuarioAtual, destinatario]);

  async function enviar() {
    if (!texto.trim() || !destinatario) return;
    setErroEnvio('');
    try {
      const novaMensagem = await enviarMensagemApi(usuarioAtual, destinatario, texto.trim());
      if (novaMensagem && novaMensagem.texto) {
        setMensagens(prev => [...prev, novaMensagem]);
        setTexto('');
      }
    } catch (e) {
      setErroEnvio('Não foi possível enviar a mensagem.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topoSeletor}>
        <Text style={styles.tituloSeletor}>Mensagens</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollUsuarios}>
          {usuarios.map(u => {
            const ativo = destinatario === u.nomeUsuario;
            return (
              <TouchableOpacity
                key={u.nomeUsuario}
                style={[styles.botaoUsuario, ativo && styles.botaoUsuarioAtivo]}
                onPress={() => setDestinatario(u.nomeUsuario)}
              >
                <Text style={[styles.textoUsuario, ativo && styles.textoUsuarioAtivo]}>
                  {u.nomeUsuario}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {destinatario ? (
        <>
          <View style={styles.headerChat}>
            <View style={styles.statusRow}>
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?background=EFEFEF&color=262626&name=${encodeURIComponent(destinatario)}`
                }}
                style={styles.chatAvatar}
              />
              <View>
                <Text style={styles.tituloChat}>{destinatario}</Text>
                <Text style={styles.onlineLabel}>Ativo agora</Text>
              </View>
            </View>
            {!!erroEnvio && <Text style={styles.erroTexto}>{erroEnvio}</Text>}
          </View>

          <FlatList
            data={mensagens}
            keyExtractor={(item, index) => String(item?.id || index)}
            renderItem={({ item }) => {
              const souEu = item.remetente === usuarioAtual;
              return (
                <View style={[styles.balaoMensagem, souEu ? styles.meuBalao : styles.outroBalao]}>
                  <Text style={[styles.textoBalao, souEu && styles.meuTextoBalao]}>{item.texto}</Text>
                </View>
              );
            }}
            contentContainerStyle={{ padding: 16 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensagem..."
              placeholderTextColor={COLORS.textMuted}
              value={texto}
              onChangeText={setTexto}
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviar}>
              <Ionicons name="paper-plane" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.avisoVazio}>
          <Ionicons name="paper-plane-outline" size={40} color={COLORS.textMuted} />
          <Text style={styles.textoAviso}>Suas mensagens diretas</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  topoSeletor: { padding: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tituloSeletor: { fontFamily: FONTS.bold, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  scrollUsuarios: { flexDirection: 'row' },
  botaoUsuario: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: COLORS.pillBg, borderRadius: 16, marginRight: 8 },
  botaoUsuarioAtivo: { backgroundColor: COLORS.textPrimary },
  textoUsuario: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  textoUsuarioAtivo: { color: '#FFF' },
  headerChat: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  chatAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: COLORS.borderLight },
  tituloChat: { fontFamily: FONTS.bold, fontWeight: '700', fontSize: 14, color: COLORS.textPrimary },
  onlineLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary },
  erroTexto: { fontFamily: FONTS.regular, color: COLORS.danger, fontSize: 12, marginTop: 4 },
  balaoMensagem: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginVertical: 3, maxWidth: '75%' },
  meuBalao: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  outroBalao: { backgroundColor: COLORS.pillBg, alignSelf: 'flex-start' },
  textoBalao: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textPrimary },
  meuTextoBalao: { color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'center' },
  input: { flex: 1, fontFamily: FONTS.regular, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9, fontSize: 14, color: COLORS.textPrimary },
  botaoEnviar: { justifyContent: 'center', paddingHorizontal: 12 },
  avisoVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  textoAviso: { fontFamily: FONTS.medium, color: COLORS.textSecondary, marginTop: 10, fontSize: 14 }
});
