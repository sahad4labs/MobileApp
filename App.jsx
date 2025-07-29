import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, Linking, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';


const dummyProfiles = [
  { id: '1', name: 'Hanan', phone: '6383565162' },
  { id: '2', name: 'Sahad', phone: '8075011889' },
];

const App = () => {
 

  const [loading, setLoading] = useState(false);
  const [lastCalled, setLastCalled] = useState(null);
  const [recordingResult, setRecordingResult] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO, 
          ]);
          const allGranted = Object.values(granted).every(res => res === PermissionsAndroid.RESULTS.GRANTED);
          if (!allGranted) {
            Alert.alert('Permission Denied', 'App needs storage access to read recordings.');
          }
        } catch (err) {
          console.warn('Permission error:', err);
        }
      }
    };
    requestPermissions();
  }, []);

  const getLatestRecording = async () => {
    const folder = '/storage/emulated/0/Recordings/Call';
    const exists = await RNFS.exists(folder);
    if (!exists) return null;

    const files = await RNFS.readDir(folder);
    const audioFiles = files.filter(file =>
      file.name.endsWith('.mp3') || file.name.endsWith('.amr') || file.name.endsWith('.m4a')
    );

    if (audioFiles.length > 0) {
      const sorted = audioFiles.sort((a, b) => b.mtime - a.mtime);
      return sorted[0].path;
    }
    return null;
  };

  const handleCall = async (profile) => {
    try {
      setLoading(true);
      Alert.alert('Call Reminder', 'Ensure call recording is enabled in your dialer.');
      setLastCalled(profile);
      setRecordingResult(null); 
      Linking.openURL(`tel:${profile.phone}`);
      setLoading(false);
    } catch (err) {
      console.error('Call error:', err);
      setLoading(false);
    }
  };

  const checkRecording = async () => {
    if (!lastCalled) {
      Alert.alert('No call found', 'Please make a call first.');
      return;
    }

    const latest = await getLatestRecording();
    if (latest) {
      console.log(`✅ Recording found for ${lastCalled.name}: ${latest}`);
      setRecordingResult(latest);
      Alert.alert('Recording Found', `File: ${latest}`);
    } else {
      console.log(`❌ No recording found for ${lastCalled.name}`);
      setRecordingResult('not_found');
      Alert.alert('No Recording Found', 'Recording file not found yet.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Call Candidates</Text>
      <FlatList
        data={dummyProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Button
              title={loading ? 'Calling...' : `Call ${item.phone}`}
              onPress={() => handleCall(item)}
              disabled={loading}
            />
            {lastCalled?.id === item.id && (
              <View style={{ marginTop: 8 }}>
                <Button title="Done & Check Recording" onPress={checkRecording} />
                {recordingResult && (
                  <Text style={styles.resultText}>
                    {recordingResult === 'not_found'
                      ? 'No recording found.'
                      : `Recording Path: ${recordingResult}`}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: { fontSize: 18, marginBottom: 8 },
  resultText: {
    marginTop: 6,
    fontSize: 12,
    color: '#374151',
    fontStyle: 'italic',
  },
});
