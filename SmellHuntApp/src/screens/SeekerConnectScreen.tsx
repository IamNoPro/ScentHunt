// src/screens/SeekerConnectScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { BleManager, Device, State as BleState } from 'react-native-ble-plx';

interface Props {
  onConnected: (device: Device) => void;
}

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';

export default function SeekerConnectScreen({ onConnected }: Props) {
  const [manager]   = useState(new BleManager());
  const [scanning, setScanning] = useState(false);

  // useEffect(() => {
  //   // Clean up on unmount
  //   return () => manager.destroy();
  // }, [manager]);

  // Wait for BLE powered on
  useEffect(() => {
    const sub = manager.onStateChange((state) => {
      if (state === BleState.PoweredOn) {
        sub.remove();
      }
    }, true);
    return () => sub.remove();
  }, [manager]);

  const startScan = async () => {
    // Android runtime permission
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Required to scan for the smell device',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Alert.alert('Permission denied', 'Cannot scan without location permission.');
      }
    }

    setScanning(true);

    manager.startDeviceScan(
      [SERVICE_UUID],            // Only look for our service
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          setScanning(false);
          return Alert.alert('Scan Error', error.message);
        }
        if (device) {
          console.log(`Found device: ${device.name} (${device.id})`);
          // connect as soon as we see our service
          manager.stopDeviceScan();
          device
            .connect()
            .then(d => d.discoverAllServicesAndCharacteristics())
            .then(d => {
              setScanning(false);
              onConnected(d);
            })
            .catch(err => {
              setScanning(false);
              Alert.alert('Connection Error', err.message);
            });
        }
      }
    );

    // Safety timeout
    setTimeout(() => {
      if (scanning) {
        manager.stopDeviceScan();
        setScanning(false);
        Alert.alert('Timeout', 'Could not find the smell device.');
      }
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seeker: Connect to Smell Device</Text>
      {scanning ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Scan & Connect" onPress={startScan} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
});
