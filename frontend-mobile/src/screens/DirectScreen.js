import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { listarUsuariosApi, buscarMensagensApi, enviarMensagemApi } from '../services/api';

export default function DirectScreen({ usuarioAtual }) {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState('ada.lovelace');
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    listarUsuariosApi().then(lista => {
      const outros = lista.filter(u => u.nomeUsuario !== usuarioAtual);
      setUsuarios(outros);
      if (outros.length > 0) setDestinatario(outros[0].nomeUsuario);
    });
  }, [usuarioAtual]);

  useEffect(() => {
    if (!destinatario) return;
    async function carregar() {
      const msgs = await buscarMensagensApi(usuarioAtual, destinatario);
      setMensagens(msgs);
    }
    carregar();
    const interval = setInterval(carregar, 3000);
    return () => clearInterval(interval);
  }, [usuarioAtual, destinatario]);

  async function enviar() {
    if (!texto.trim()) return;
    const nova = await enviarMensagemApi(usuarioAtual, destinatario, texto);
    setMensagens([...mensagens, nova]);
    setTexto('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerChat}>
        <Text style={styles.tituloChat}>Conversando com: {destinatario}</Text>
      </View>
      <FlatList
        data={mensagens}
        keyExtractor={(item) => String(item.id || Math.random())}
        renderItem={({ item }) => {
            const meu = item.remetente === usuarioAtual;
            return (
              <View style={[styles.balao, meu ? styles.meuBalao : styles.outroBalao]}>
                <Text style={styles.textoBalao}>{item.texto}</Text>
              </View>
            );
        }}
        contentContainerStyle={{ padding: 15 }}
      />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Mensagem..." value={texto} onChangeText={setTexto} />
        <TouchableOpacity onPress={enviar} style={styles.botaoEnviar}><Text style={styles.textoEnviar}>Enviar</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  headerChat: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#DBDBDB', backgroundColor: '#FFF' },
  tituloChat: { fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: '#262626' },
  balao: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: '75%' },
  meuBalao: { backgroundColor: '#E0F1FF', alignSelf: 'flex-end' },
  outroBalao: { backgroundColor: '#EFEFEF', alignSelf: 'flex-start' },
  textoBalao: { fontSize: 14, color: '#262626' },
  inputRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#DBDBDB', backgroundColor: '#FFF' },
  input: { flex: 1, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14 },
  botaoEnviar: { justifyContent: 'center', paddingHorizontal: 15 },
  textoEnviar: { color: '#0095F6', fontWeight: 'bold', fontSize: 14 },
});
