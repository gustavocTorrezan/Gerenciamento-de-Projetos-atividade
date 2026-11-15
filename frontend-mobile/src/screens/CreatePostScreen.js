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

const SUGESTOES_FOTOS = [
  {
    titulo: 'Setup Dev',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
  },
  {
    titulo: 'Código Java',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
  },
  {
    titulo: 'Café & Estudo',
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
      setErro('Cole o link de uma imagem para publicar.');
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
        <Text style={styles.titulo}>Nova publicação</Text>
        <Text style={styles.subtitulo}>Compartilhe uma foto no feed do InstaCC</Text>

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
              <Text style={styles.placeholderIcon}>🖼️</Text>
              <Text style={styles.placeholderTexto}>
                {erroImagem
                  ? 'Não foi possível carregar essa URL. Tente outro link.'
                  : 'A pré-visualização da foto aparecerá aqui'}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.label}>URL da imagem</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemplo.com/minha-foto.jpg"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={imagemUrl}
          onChangeText={(txt) => {
            setErroImagem(false);
            setImagemUrl(txt);
          }}
        />

        <View style={styles.sugestoesRow}>
          <Text style={styles.sugestoesLabel}>Exemplos rápidos:</Text>
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
          placeholderTextColor="#999"
          multiline
          value={legenda}
          onChangeText={setLegenda}
        />

        {!!erro && <Text style={styles.erroTexto}>{erro}</Text>}

        <TouchableOpacity style={styles.botaoPublicar} onPress={publicar}>
          <Text style={styles.textoBotao}>Compartilhar no Feed</Text>
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
    backgroundColor: '#F6F7F9',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: '#8E8E8E',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  previewBox: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E6E6E6',
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
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderTexto: {
    fontSize: 13,
    color: '#8E8E8E',
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#262626',
    marginBottom: 10,
  },
  inputLegenda: {
    height: 76,
    textAlignVertical: 'top',
  },
  sugestoesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 14,
  },
  sugestoesLabel: {
    fontSize: 12,
    color: '#8E8E8E',
    marginRight: 8,
    marginBottom: 4,
  },
  chipSugestao: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 4,
  },
  chipTexto: {
    fontSize: 12,
    color: '#262626',
    fontWeight: '500',
  },
  erroTexto: {
    color: '#ED4956',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  botaoPublicar: {
    backgroundColor: '#0095F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
