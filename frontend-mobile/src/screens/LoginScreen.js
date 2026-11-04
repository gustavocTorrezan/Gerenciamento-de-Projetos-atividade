import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginApi } from '../services/api';

export default function LoginScreen({ onLoginSucesso }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin() {
    try {
      setErro('');
      const user = await loginApi(usuario.trim(), senha.trim());
      onLoginSucesso(user);
    } catch (e) {
      setErro('Usuario ou senha invalidos!');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>InstaCC</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nome de usuario (ex: estudante.cc)"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (ex: 1234)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#262626' },
  input: { width: '100%', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 14 },
  botao: { width: '100%', backgroundColor: '#0095F6', padding: 14, borderRadius: 6, alignItems: 'center' },
  textoBotao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  erro: { color: '#ED4956', marginBottom: 15, fontWeight: '600' },
});
