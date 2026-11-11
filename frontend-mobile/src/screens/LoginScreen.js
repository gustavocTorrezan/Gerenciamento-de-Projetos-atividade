import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { loginApi, registrarApi } from '../services/api';

export default function LoginScreen({ onLoginSucesso }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function submeter() {
    setErro('');
    setSucessoMsg('');

    const userLimpo = usuario.trim();
    const senhaLimpa = senha.trim();

    if (!userLimpo || !senhaLimpa) {
      setErro('Preencha o nome de usuário e a senha.');
      return;
    }

    setCarregando(true);
    try {
      if (modoCadastro) {
        const novoUsuario = await registrarApi(userLimpo, senhaLimpa);
        onLoginSucesso(novoUsuario);
      } else {
        const dadosUsuario = await loginApi(userLimpo, senhaLimpa);
        onLoginSucesso(dadosUsuario);
      }
    } catch (e) {
      setErro(
        modoCadastro
          ? (e.message || 'Erro ao criar conta. Tente outro nome de usuário.')
          : 'Usuário ou senha incorretos. (Teste: estudante.cc / 123)'
      );
    } finally {
      setCarregando(false);
    }
  }

  function alternarModo() {
    setErro('');
    setSucessoMsg('');
    setModoCadastro(!modoCadastro);
  }

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.logo}>InstaCC</Text>
        <Text style={styles.subtitulo}>
          {modoCadastro
            ? 'Cadastre-se para ver fotos e vídeos dos seus amigos.'
            : 'Entre com sua conta acadêmica para continuar.'}
        </Text>

        {!!erro && (
          <View style={styles.erroBox}>
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        )}

        {!!sucessoMsg && (
          <View style={styles.sucessoBox}>
            <Text style={styles.sucessoTexto}>{sucessoMsg}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário (ex: estudante.cc)"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={submeter}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.textoBotaoPrincipal}>
              {modoCadastro ? 'Cadastrar e Entrar' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.divisorRow}>
          <View style={styles.linha} />
          <Text style={styles.ouTexto}>OU</Text>
          <View style={styles.linha} />
        </View>

        <TouchableOpacity onPress={alternarModo} style={styles.botaoAlternar}>
          <Text style={styles.textoAlternar}>
            {modoCadastro
              ? 'Já tem uma conta? Conecte-se'
              : 'Não tem uma conta? Cadastre-se'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 34,
    alignItems: 'center',
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 13,
    color: '#8E8E8E',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 18,
  },
  erroBox: {
    width: '100%',
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFD6DF',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  erroTexto: {
    color: '#ED4956',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  sucessoBox: {
    width: '100%',
    backgroundColor: '#E8F8F0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  sucessoTexto: {
    color: '#1E8E3E',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#262626',
    marginBottom: 12,
  },
  botaoPrincipal: {
    width: '100%',
    backgroundColor: '#0095F6',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divisorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#DBDBDB',
  },
  ouTexto: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#8E8E8E',
    fontWeight: 'bold',
  },
  botaoAlternar: {
    paddingVertical: 6,
  },
  textoAlternar: {
    color: '#0095F6',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
