import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, COLORS } from '../styles/theme';

export default function InstaLogo({ width = 148, height = 34 }) {
  const compacto = width < 155;
  const iconBoxSize = compacto ? 28 : 34;
  const iconSize = compacto ? 17 : 21;
  const fontSize = compacto ? 20 : 24;

  const gradienteWeb =
    Platform.OS === 'web'
      ? { backgroundImage: 'linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)' }
      : {};

  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.iconBadge,
          {
            width: iconBoxSize,
            height: iconBoxSize,
            borderRadius: compacto ? 8 : 10,
          },
          gradienteWeb,
        ]}
      >
        <Ionicons name="camera-outline" size={iconSize} color="#FFFFFF" />
      </View>
      <Text style={[styles.wordmark, { fontSize }]}>InstaCC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    backgroundColor: '#DD2A7B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  wordmark: {
    fontFamily: FONTS.bold,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.7,
  },
});
