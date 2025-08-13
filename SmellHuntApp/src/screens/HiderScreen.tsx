// src/screens/HiderScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, Region, LatLng, MapPressEvent } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HiderScreenProps {
  onDone: () => void;
}

export default function HiderScreen({ onDone }: HiderScreenProps) {
  const [region, setRegion] = useState<Region | null>(null);
  const [treasure, setTreasure] = useState<LatLng | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Needed to show your position on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Cannot display your location.');
          return;
        }
      }
      Geolocation.requestAuthorization?.();
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc: LatLng = { latitude: coords.latitude, longitude: coords.longitude };
          setRegion({ ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        },
        (err) => Alert.alert('GPS Error', err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    })();
  }, []);

  const onMapPress = (e: MapPressEvent) => {
    setTreasure(e.nativeEvent.coordinate);
  };

  const confirmHide = async () => {
    if (!treasure) {
      return Alert.alert('Place Treasure', 'Tap the map to place the treasure first.');
    }
    await AsyncStorage.setItem('treasureLocation', JSON.stringify(treasure));
    Alert.alert(
      'Hidden!',
      `Treasure at\n${treasure.latitude.toFixed(5)}, ${treasure.longitude.toFixed(5)}`
    );
    onDone();
  };

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Fetching your location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        followsUserLocation
        onRegionChangeComplete={setRegion}
        onPress={onMapPress}
      >
        {treasure && (
          <Marker
            coordinate={treasure}
            title="Treasure"
            description="Tap Confirm to save this location"
          />
        )}
      </MapView>
      <View style={styles.controls}>
        <Text style={styles.instruction}>Tap to place the treasure marker.</Text>
        <Button title="Confirm Hide" onPress={confirmHide} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controls: { padding: 12, backgroundColor: '#fff' },
  instruction: { textAlign: 'center', marginBottom: 8, fontSize: 16 },
});
