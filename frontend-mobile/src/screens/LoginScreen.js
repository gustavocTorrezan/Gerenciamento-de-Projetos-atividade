import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { loginApi, registrarApi } from '../services/api';
import InstaLogo from '../components/InstaLogo';
import { FONTS, COLORS } from '../styles/theme';

export default function LoginScreen({ onLoginSucesso }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function submeter() {
    setErro('');
    const userLimpo = usuario.trim();
    const senhaLimpa = senha.trim();

    if (!userLimpo || !senhaLimpa) {
      setErro('Informe seu nome de usuário e senha.');
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
          ? (e.message || 'Não foi possível criar a conta.')
          : 'Usuário ou senha incorretos.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <View style={styles.logoWrapper}>
          <InstaLogo width={182} height={42} />
        </View>

        <Text style={styles.subtitulo}>
          {modoCadastro
            ? 'Cadastre-se para acompanhar fotos e novidades da turma.'
            : 'Entre com sua conta para continuar.'}
        </Text>

        {!!erro && (
          <View style={styles.erroBox}>
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={submeter}
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
              {modoCadastro ? 'Cadastre-se' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.divisorRow}>
          <View style={styles.linha} />
          <Text style={styles.ouTexto}>OU</Text>
          <View style={styles.linha} />
        </View>

        <TouchableOpacity
          onPress={() => {
            setErro('');
            setModoCadastro(!modoCadastro);
          }}
          style={styles.botaoAlternar}
        >
          <Text style={styles.textoSecundario}>
            {modoCadastro ? 'Tem uma conta? ' : 'Não tem uma conta? '}
            <Text style={styles.textoLink}>
              {modoCadastro ? 'Conecte-se' : 'Cadastre-se'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 36,
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: 14,
    alignItems: 'center',
  },
  subtitulo: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 19,
  },
  erroBox: {
    width: '100%',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  erroTexto: {
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  botaoPrincipal: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoPrincipal: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    fontWeight: '600',
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
    backgroundColor: COLORS.border,
  },
  ouTexto: {
    fontFamily: FONTS.bold,
    marginHorizontal: 14,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  botaoAlternar: {
    paddingVertical: 4,
  },
  textoSecundario: {
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  textoLink: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
