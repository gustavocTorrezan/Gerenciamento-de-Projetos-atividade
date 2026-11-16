import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>InstaCC</Text>
      <View style={styles.tag}>
        <Text style={styles.tagText}>CC • UniFil</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    fontSize: 23,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#262626',
    letterSpacing: -0.5,
  },
  tag: {
    marginLeft: 8,
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
  },
});
