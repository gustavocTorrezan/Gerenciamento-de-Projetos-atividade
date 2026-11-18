import React from 'react';
import { View, StyleSheet } from 'react-native';
import InstaLogo from './InstaLogo';
import { COLORS } from '../styles/theme';

export default function Header() {
  return (
    <View style={styles.header}>
      <InstaLogo width={140} height={32} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
  },
});
