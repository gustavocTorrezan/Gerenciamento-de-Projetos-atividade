import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';

export default function FeedScreen({ posts, onCurtir, onComentar }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onCurtir={() => onCurtir(item.id)}
            onComentar={(texto) => onComentar(item.id, texto)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
});
