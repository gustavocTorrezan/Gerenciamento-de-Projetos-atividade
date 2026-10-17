import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewPostScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Publicação</Text>
      <Text style={styles.subtitulo}>
        O formulário de envio de imagens será implementado na Semana 4.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#262626',
  },
  subtitulo: {
    fontSize: 14,
    color: '#8E8E8E',
    textAlign: 'center',
  },
});
