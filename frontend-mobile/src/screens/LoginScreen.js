import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginApi, registrarApi } from '../services/api';

export default function LoginScreen({ onLoginSucesso }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit() {
    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha todos os campos!');
      return;
    }
    try {
      setErro('');
      let user;
      if (isRegistrando) {
        user = await registrarApi(usuario.trim(), senha.trim());
      } else {
        user = await loginApi(usuario.trim(), senha.trim());
      }
      onLoginSucesso(user);
    } catch (e) {
      setErro(isRegistrando ? 'Erro ao registrar usuario.' : 'Usuario ou senha invalidos!');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>InstaCC</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nome de usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
        <Text style={styles.textoBotao}>{isRegistrando ? 'Cadastrar' : 'Entrar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegistrando(!isRegistrando)} style={styles.linkTroca}>
        <Text style={styles.textoLink}>
          {isRegistrando ? 'Ja tem uma conta? Fazer login' : 'Nao tem uma conta? Cadastre-se'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' },
  logo: { fontSize: 36, fontWeight: 'bold', marginBottom: 30, color: '#262626' },
  input: { width: '100%', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 14 },
  botao: { width: '100%', backgroundColor: '#0095F6', padding: 14, borderRadius: 6, alignItems: 'center', marginBottom: 15 },
  textoBotao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  erro: { color: '#ED4956', marginBottom: 15, fontWeight: '600' },
  linkTroca: { marginTop: 10 },
  textoLink: { color: '#0095F6', fontSize: 14, fontWeight: '600' },
});
