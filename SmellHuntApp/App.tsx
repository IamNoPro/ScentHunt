// src/App.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  HomeScreen,
  HiderScreen,
  SeekerConnectScreen,
  SeekerNavigationScreen,
} from './src/screens';
import { Device } from 'react-native-ble-plx';

type Role = 'home' | 'hider' | 'seekerConnect' | 'seekerNav';

export default function App() {
  const [role, setRole]       = useState<Role>('home');
  const [bleDevice, setDevice] = useState<Device | null>(null);

  const handleSelectRole = (r: 'hider' | 'seeker') => {
    setRole(r === 'hider' ? 'hider' : 'seekerConnect');
  };
  const handleHiderDone = () => setRole('home');
  const handleSeekerConnected = (d: Device) => {
    setDevice(d);
    setRole('seekerNav');
  };

  switch (role) {
    case 'home':
      return <HomeScreen onSelectRole={handleSelectRole} />;
    case 'hider':
      return <HiderScreen onDone={handleHiderDone} />;
    case 'seekerConnect':
      return (
        <SeekerConnectScreen onConnected={handleSeekerConnected} />
      );
    case 'seekerNav':
      return (
        <SeekerNavigationScreen device={bleDevice!} />
      );
    default:
      return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({ container: { flex: 1 } });
