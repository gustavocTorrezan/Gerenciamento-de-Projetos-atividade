import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from './src/components/Header';
import BottomTab from './src/components/BottomTab';
import FeedScreen from './src/screens/FeedScreen';
import NewPostScreen from './src/screens/NewPostScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('feed');

  function renderizarTela() {
    if (abaAtiva === 'feed') {
      return <FeedScreen />;
    }
    if (abaAtiva === 'novoPost') {
      return <NewPostScreen />;
    }
    return <ProfileScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header />
      <View style={styles.conteudo}>
        {renderizarTela()}
      </View>
      <BottomTab abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
  },
});
