import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HomeProps {
  onSelectRole: (role: 'hider' | 'seeker') => void;
}

export default function HomeScreen({ onSelectRole }: HomeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smell Treasure Hunt</Text>
      <TouchableOpacity
        style={[styles.button, styles.hiderButton]}
        onPress={() => onSelectRole('hider')}
      >
        <Text style={styles.buttonText}>I am the Hider</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.seekerButton]}
        onPress={() => onSelectRole('seeker')}
      >
        <Text style={styles.buttonText}>I am the Seeker</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 48,
    color: '#054a91',
  },
  button: {
    width: '80%',
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
  },
  hiderButton: {
    backgroundColor: '#3b8ed0',
  },
  seekerButton: {
    backgroundColor: '#1c6ea4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
