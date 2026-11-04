import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { listarUsuariosApi, buscarMensagensApi, enviarMensagemApi } from '../services/api';

export default function DirectScreen({ usuarioAtual }) {
  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');

  // Carrega a lista de usuários do sistema tirando o usuário logado
  useEffect(() => {
    listarUsuariosApi().then(lista => {
      const outros = lista.filter(u => u.nomeUsuario !== usuarioAtual);
      setUsuarios(outros);
      if (outros.length > 0) {
        setDestinatario(outros[0].nomeUsuario);
      }
    });
  }, [usuarioAtual]);

  // Atualiza as mensagens da conversa atual a cada 2 segundos
  useEffect(() => {
    if (!destinatario) return;
    
    async function carregarMensagens() {
      const msgs = await buscarMensagensApi(usuarioAtual, destinatario);
      setMensagens(msgs || []);
    }

    carregarMensagens();
    const interval = setInterval(carregarMensagens, 2000);
    return () => clearInterval(interval);
  }, [usuarioAtual, destinatario]);

  async function enviar() {
    if (!texto.trim() || !destinatario) return;
    const novaMensagem = await enviarMensagemApi(usuarioAtual, destinatario, texto);
    setMensagens(prev => [...prev, novaMensagem]);
    setTexto('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topoSeletor}>
        <Text style={styles.tituloSeletor}>Conversar com:</Text>
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
            <Text style={styles.tituloChat}>Chat ativo com: @{destinatario}</Text>
          </View>

          <FlatList
            data={mensagens}
            keyExtractor={(item, index) => String(item.id || index)}
            renderItem={({ item }) => {
              const souEu = item.remetente === usuarioAtual;
              return (
                <View style={[styles.balaoMensagem, souEu ? styles.meuBalao : styles.outroBalao]}>
                  <Text style={styles.remetenteBalao}>{item.remetente}:</Text>
                  <Text style={styles.textoBalao}>{item.texto}</Text>
                </View>
              );
            }}
            contentContainerStyle={{ padding: 15 }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem..."
              value={texto}
              onChangeText={setTexto}
            />
            <TouchableOpacity style={styles.botaoEnviar} onPress={enviar}>
              <Text style={styles.textoEnviar}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.avisoVazio}>
          <Text style={styles.textoAviso}>Nenhum usuario encontrado para conversar. Cadastre outro usuario!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topoSeletor: { padding: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#DBDBDB' },
  tituloSeletor: { fontSize: 12, fontWeight: 'bold', color: '#8E8E8E', marginBottom: 6 },
  scrollUsuarios: { flexDirection: 'row' },
  botaoUsuario: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#EFEFEF', borderRadius: 16, marginRight: 8, borderWidth: 1, borderColor: '#DBDBDB' },
  botaoUsuarioAtivo: { backgroundColor: '#0095F6', borderColor: '#0095F6' },
  textoUsuario: { fontSize: 13, color: '#262626', fontWeight: '600' },
  textoUsuarioAtivo: { color: '#FFF' },
  headerChat: { padding: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#DBDBDB', alignItems: 'center' },
  tituloChat: { fontWeight: 'bold', fontSize: 14, color: '#262626' },
  balaoMensagem: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: '75%' },
  meuBalao: { backgroundColor: '#E0F1FF', alignSelf: 'flex-end' },
  outroBalao: { backgroundColor: '#EFEFEF', alignSelf: 'flex-start' },
  remetenteBalao: { fontSize: 10, color: '#666', fontWeight: 'bold', marginBottom: 2 },
  textoBalao: { fontSize: 14, color: '#262626' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#DBDBDB' },
  input: { flex: 1, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, fontSize: 14 },
  botaoEnviar: { justifyContent: 'center', paddingHorizontal: 15 },
  textoEnviar: { color: '#0095F6', fontWeight: 'bold', fontSize: 14 },
  avisoVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  textoAviso: { color: '#8E8E8E', textAlign: 'center' }
});
