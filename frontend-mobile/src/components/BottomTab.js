import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BottomTab({ abaAtiva, setAbaAtiva }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.botaoAba}
        onPress={() => setAbaAtiva('feed')}
      >
        <Text style={[styles.textoAba, abaAtiva === 'feed' && styles.abaSelecionada]}>
          🏠 Feed
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoAba}
        onPress={() => setAbaAtiva('novoPost')}
      >
        <Text style={[styles.textoAba, abaAtiva === 'novoPost' && styles.abaSelecionada]}>
          ➕ Publicar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoAba}
        onPress={() => setAbaAtiva('perfil')}
      >
        <Text style={[styles.textoAba, abaAtiva === 'perfil' && styles.abaSelecionada]}>
          👤 Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  botaoAba: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textoAba: {
    fontSize: 15,
    color: '#8E8E8E',
  },
  abaSelecionada: {
    color: '#262626',
    fontWeight: 'bold',
  },
});
