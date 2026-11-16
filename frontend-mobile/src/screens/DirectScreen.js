import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { listarUsuariosApi, buscarMensagensApi, enviarMensagemApi } from '../services/api';

export default function DirectScreen({ usuarioAtual }) {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [erroEnvio, setErroEnvio] = useState('');

  useEffect(() => {
    setDestinatario(null);
    setMensagens([]);
    listarUsuariosApi().then(lista => {
      const outros = (lista || []).filter(u => u && u.nomeUsuario && u.nomeUsuario !== usuarioAtual);
      setUsuarios(outros);
      if (outros.length > 0) {
        setDestinatario(outros[0].nomeUsuario);
      }
    });
  }, [usuarioAtual]);

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
        <Text style={styles.tituloSeletor}>Mensagens Diretas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollUsuarios}>
          {usuarios.map(u => (
            <TouchableOpacity
              key={u.nomeUsuario}
              style={[styles.botaoUsuario, destinatario === u.nomeUsuario && styles.botaoUsuarioAtivo]}
              onPress={() => setDestinatario(u.nomeUsuario)}
            >
              <Text style={[styles.textoUsuario, destinatario === u.nomeUsuario && styles.textoUsuarioAtivo]}>
                @{u.nomeUsuario}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {destinatario ? (
        <>
          <View style={styles.headerChat}>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.tituloChat}>@{destinatario}</Text>
              <Text style={styles.onlineLabel}>• Online agora</Text>
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
                  {!souEu && <Text style={styles.remetenteBalao}>@{item.remetente}</Text>}
                  <Text style={[styles.textoBalao, souEu && styles.meuTextoBalao]}>{item.texto}</Text>
                </View>
              );
            }}
            contentContainerStyle={{ padding: 15 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Envie uma mensagem..."
              placeholderTextColor="#999"
              value={texto}
              onChangeText={setTexto}
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviar}>
              <Text style={styles.textoEnviar}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.avisoVazio}>
          <Text style={styles.textoAviso}>Nenhum usuário disponível para conversar.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topoSeletor: { padding: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  tituloSeletor: { fontSize: 12, fontWeight: 'bold', color: '#8E8E8E', marginBottom: 8, textTransform: 'uppercase' },
  scrollUsuarios: { flexDirection: 'row' },
  botaoUsuario: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#F2F3F5', borderRadius: 18, marginRight: 8 },
  botaoUsuarioAtivo: { backgroundColor: '#0095F6' },
  textoUsuario: { fontSize: 13, color: '#262626', fontWeight: '600' },
  textoUsuarioAtivo: { color: '#FFF' },
  headerChat: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#31A24C', marginRight: 6 },
  tituloChat: { fontWeight: 'bold', fontSize: 14, color: '#262626' },
  onlineLabel: { fontSize: 12, color: '#31A24C', marginLeft: 6, fontWeight: '500' },
  erroTexto: { color: '#ED4956', fontSize: 12, marginTop: 4 },
  balaoMensagem: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, marginVertical: 4, maxWidth: '75%' },
  meuBalao: { backgroundColor: '#0095F6', alignSelf: 'flex-end' },
  outroBalao: { backgroundColor: '#EFEFEF', alignSelf: 'flex-start' },
  remetenteBalao: { fontSize: 10, color: '#666', fontWeight: 'bold', marginBottom: 2 },
  textoBalao: { fontSize: 14, color: '#262626' },
  meuTextoBalao: { color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EAEAEA', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9, fontSize: 14, color: '#262626' },
  botaoEnviar: { justifyContent: 'center', paddingHorizontal: 14 },
  textoEnviar: { color: '#0095F6', fontWeight: 'bold', fontSize: 14 },
  avisoVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  textoAviso: { color: '#8E8E8E', textAlign: 'center' }
});
