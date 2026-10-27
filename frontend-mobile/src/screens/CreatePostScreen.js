import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CreatePostScreen({ onPublicar }) {
  const [imagemUrl, setImagemUrl] = useState('');
  const [legenda, setLegenda] = useState('');

  function handleSubmeter() {
    const urlFinal = imagemUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600';
    onPublicar(urlFinal, legenda);
    setImagemUrl('');
    setLegenda('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Publicacao</Text>
      <TextInput
        style={styles.input}
        placeholder="Cole a URL da imagem (ex: https://i.imgur.com/...)"
        value={imagemUrl}
        onChangeText={setImagemUrl}
      />
      <TextInput
        style={[styles.input, styles.inputLegenda]}
        placeholder="Escreva uma legenda..."
        value={legenda}
        onChangeText={setLegenda}
        multiline
      />
      <TouchableOpacity style={styles.botao} onPress={handleSubmeter}>
        <Text style={styles.textoBotao}>Compartilhar no Feed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#262626' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DBDBDB', borderRadius: 6, padding: 12, marginBottom: 15, fontSize: 14 },
  inputLegenda: { height: 90, textAlignVertical: 'top' },
  botao: { backgroundColor: '#0095F6', padding: 14, borderRadius: 6, alignItems: 'center' },
  textoBotao: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});
