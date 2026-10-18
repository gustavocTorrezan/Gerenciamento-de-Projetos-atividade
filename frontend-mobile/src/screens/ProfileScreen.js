import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil do Usuário</Text>
      <Text style={styles.subtitulo}>
        Os dados completos do perfil e grade de fotos serão implementados na Semana 7.
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
