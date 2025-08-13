// src/screens/SeekerNavigationScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

interface Props {
  device: Device;
}

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHAR_UUID    = 'abcd1234-5678-90ab-cdef-1234567890ab';

// Haversine distance (m)
function getDistance(a: LatLng, b: LatLng) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x = Math.sin(dLat/2)**2 +
            Math.cos(lat1)*Math.cos(lat2) *
            Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Bearing from a→b in degrees [0,360)
function getBearing(a: LatLng, b: LatLng) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const toDeg = (v: number) => (v * 180) / Math.PI;
  const φ1 = toRad(a.latitude);
  const φ2 = toRad(b.latitude);
  const Δλ = toRad(b.longitude - a.longitude);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2)
          - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export default function SeekerNavigationScreen({ device }: Props) {
  const [treasure, setTreasure]   = useState<LatLng | null>(null);
  const [position, setPosition]   = useState<LatLng | null>(null);
  const [heading, setHeading]     = useState<number>(0);
  const [count, setCount]         = useState<number>(0);
  const [found, setFound]         = useState<boolean>(false);

  const mapRef = useRef<MapView>(null);

  // 1️⃣ Load treasure
  useEffect(() => {
    AsyncStorage.getItem('treasureLocation')
      .then(json => {
        if (!json) throw new Error('No treasure saved');
        setTreasure(JSON.parse(json));
      })
      .catch(err => Alert.alert('Error', err.message));
  }, []);

  // 2️⃣ Watch GPS for pos + heading
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Needed to track your position.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      ).catch(console.warn);
    }

    const watchId = Geolocation.watchPosition(
      pos => {
        const { latitude, longitude, heading: hdg } = pos.coords;
        const loc = { latitude, longitude };
        setPosition(loc);
        setHeading(hdg ?? 0);

        mapRef.current?.animateToRegion(
          { ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 },
          500
        );
      },
      err => Alert.alert('GPS Error', err.message),
      { enableHighAccuracy: true, distanceFilter: 1, interval: 1000 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  // 3️⃣ BLE write helper
  const sendCmd = (cmd: number) => {
    const base64 = Buffer.from([cmd]).toString('base64');
    device
      .writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, base64)
      .then(() => console.log(cmd))
      .catch(e => console.warn('BLE write failed', e.message));
  };

  // 4️⃣ “Need Direction” logic
  const handleNeedDirection = () => {
    if (!position || !treasure) return;
    setCount(c => c + 1);

    const dist = getDistance(position, treasure);
    if (dist < 10 && !found) {
      setFound(true);
      sendCmd(2);  // 2 = Stop
      Alert.alert('🎉 Found!', 'You found the treasure!');
      return;
    }

    const bearingTo = getBearing(position, treasure);
    const delta = (bearingTo - heading + 360) % 360;

    let cmd: number;
    if (delta < 45 || delta > 315) {
      cmd = 4;   // 4 = Forward
    } else if (delta >= 45 && delta < 135) {
      cmd = 1;   // 1 = Right
    } else if (delta >= 225 && delta <= 315) {
      cmd = 3;   // 3 = Left
    } else {
      cmd = delta < 180 ? 1 : 3;
    }
    sendCmd(cmd);
  };

  if (!position) {
    return (
      <View style={styles.loader}>
        <Text>Waiting for GPS…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Counter */}
      <View style={styles.header}>
        <Text style={styles.counter}>Presses: {count}</Text>
      </View>

      {/* Map with circle + arrow */}
      <MapView ref={mapRef} style={styles.map}>
        <Marker coordinate={position}>
        <View
    style={[
      styles.markerWrap,
      { transform: [{ rotate: `${heading}deg` }] },  // rotate wrapper
    ]}
  >
    <View style={styles.circle} />
    <View style={styles.triangle} />
  </View>
        </Marker>

        {found && treasure && (
          <Marker coordinate={treasure} title="Treasure" pinColor="gold" />
        )}
      </MapView>

      {/* Need Direction button */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleNeedDirection}>
          <Text style={styles.btnText}>Need Direction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map:       { flex: 1 },

  loader: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },

  header: {
    position: 'absolute',
    top:    40,
    left:   0,
    right:  0,
    alignItems: 'center',
    zIndex: 2,
  },
  counter: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      8,
    fontSize: 16,
    fontWeight: '600',
  },

  markerWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    // no padding/margin so triangle sits right on the circle
  },

  // circle at the center
  circle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1c6ea4',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // triangle arrow on top edge of circle
  triangle: {
    position: 'absolute',
    top: 0,            // flush at top of wrapper
    width: 0,
    height: 0,
    borderLeftWidth:   6,
    borderRightWidth:  6,
    borderBottomWidth: 10,
    borderLeftColor:   'transparent',
    borderRightColor:  'transparent',
    borderBottomColor: '#1c6ea4',
  },

  controls: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#1c6ea4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
