import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, COLORS } from '../styles/theme';

const SUGESTOES_FOTOS = [
  {
    titulo: 'Setup',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
  },
  {
    titulo: 'Código',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
  },
  {
    titulo: 'Café',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80'
  }
];

export default function CreatePostScreen({ onPublicar }) {
  const [imagemUrl, setImagemUrl] = useState('');
  const [legenda, setLegenda] = useState('');
  const [erro, setErro] = useState('');
  const [erroImagem, setErroImagem] = useState(false);

  function publicar() {
    setErro('');
    if (!imagemUrl.trim()) {
      setErro('Informe o link de uma imagem.');
      return;
    }
    if (onPublicar) {
      onPublicar(imagemUrl.trim(), legenda.trim());
    }
    setImagemUrl('');
    setLegenda('');
    setErroImagem(false);
  }

  const urlValida = imagemUrl.trim().startsWith('http');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Criar nova publicação</Text>

        <View style={styles.previewBox}>
          {urlValida && !erroImagem ? (
            <Image
              source={{ uri: imagemUrl.trim() }}
              style={styles.previewImagem}
              resizeMode="cover"
              onError={() => setErroImagem(true)}
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Ionicons name="image-outline" size={38} color={COLORS.textMuted} />
              <Text style={styles.placeholderTexto}>
                {erroImagem
                  ? 'Não foi possível carregar a imagem'
                  : 'Pré-visualização da foto'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>Link da imagem</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          value={imagemUrl}
          onChangeText={(txt) => {
            setErroImagem(false);
            setImagemUrl(txt);
          }}
        />

        <View style={styles.sugestoesRow}>
          {SUGESTOES_FOTOS.map((item) => (
            <TouchableOpacity
              key={item.titulo}
              style={styles.chipSugestao}
              onPress={() => {
                setErroImagem(false);
                setImagemUrl(item.url);
              }}
            >
              <Text style={styles.chipTexto}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Legenda</Text>
        <TextInput
          style={[styles.input, styles.inputLegenda]}
          placeholder="Escreva uma legenda..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          value={legenda}
          onChangeText={setLegenda}
        />

        {!!erro && <Text style={styles.erroTexto}>{erro}</Text>}

        <TouchableOpacity style={styles.botaoPublicar} onPress={publicar}>
          <Text style={styles.textoBotao}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    maxWidth: 490,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  titulo: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewBox: {
    width: '100%',
    height: 250,
    borderRadius: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImagem: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderTexto: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  input: {
    fontFamily: FONTS.regular,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  inputLegenda: {
    height: 74,
    textAlignVertical: 'top',
  },
  sugestoesRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  chipSugestao: {
    backgroundColor: COLORS.pillBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
  },
  chipTexto: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  erroTexto: {
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  botaoPublicar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: {
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
