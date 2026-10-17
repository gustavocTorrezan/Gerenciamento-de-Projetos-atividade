import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoTexto}>InstaCC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoTexto: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262626',
  },
});
