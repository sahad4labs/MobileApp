import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      if (currentSound) {
        currentSound.release();
      }
    };
  }, []);

 const requestPermissions = async () => {
  if (Platform.OS !== 'android') {
    // iOS or other platforms – go ahead
    return loadRecordings();
  }

  try {
    // -- Android 13+ needs READ_MEDIA_AUDIO --
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        {
          title: 'Audio Permission',
          message: 'App needs access to your audio files',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission denied',
          'Cannot access recordings without audio permission'
        );
        setLoading(false);
        return;
      }
    }
    // -- Android 12 and below --
    else {
      const rw = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        rw['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
        rw['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert(
          'Permission denied',
          'Storage permission is required to access recordings'
        );
        setLoading(false);
        return;
      }
    }

    // -- Android 11+ (API 30+) “All files access” if needed --
    if (Platform.Version >= 30) {
      const manageGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
      );
      if (!manageGranted) {
        Alert.alert(
          'All files access required',
          'Please grant All Files Access in system settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
        setLoading(false);
        return;
      }
    }

    // All permissions satisfied, load files
    loadRecordings();
  } catch (err) {
    console.warn('Permission error:', err);
    setLoading(false);
  }
};

  const loadRecordings = async () => {
    try {
      const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma', '.3gp', '.amr'];

      const voiceRecorderPath = '/storage/emulated/0/Recordings/Call';



      console.log('=== CHECKING VOICE RECORDER PATH ===');
      console.log('Target path:', voiceRecorderPath);

      let allRecordings = [];
      let debugInfo = [];

      try {
        console.log('\n--- Checking path: ${voiceRecorderPath} ---');
        const exists = await RNFS.exists(voiceRecorderPath);
        console.log(`Path exists: ${exists}`);

        if (exists) {
          const files = await RNFS.readDir(voiceRecorderPath);
          console.log(`Found ${files.length} total files/folders`);

          // Log all files for debugging
          files.forEach(file => {
            console.log(`File: ${file.name} | IsFile: ${file.isFile()} | Size: ${file.size}`);
          });

          const audioFiles = files.filter(file =>
            file.isFile() && audioExtensions.some(ext =>
              file.name.toLowerCase().endsWith(ext.toLowerCase())
            )
          );

          console.log(`Found ${audioFiles.length} audio files in this directory`);
          audioFiles.forEach(file => {
            console.log(`Audio file: ${file.name}`);
          });

          const formattedFiles = audioFiles.map(file => ({
            id: file.path,
            name: file.name,
            path: file.path,
            size: file.size,
            modificationTime: file.mtime,
            folder: 'Voice Recorder',
          }));

          allRecordings = [...allRecordings, ...formattedFiles];

          debugInfo.push({
            path: voiceRecorderPath,
            exists: true,
            totalFiles: files.length,
            audioFiles: audioFiles.length,
            fileNames: audioFiles.map(f => f.name)
          });
        } else {
          console.log('Voice Recorder path does not exist');
          debugInfo.push({
            path: voiceRecorderPath,
            exists: false,
            totalFiles: 0,
            audioFiles: 0,
            fileNames: []
          });
        }
      } catch (error) {
        console.log(`Error reading Voice Recorder directory:, error`);
        debugInfo.push({
          path: voiceRecorderPath,
          exists: false,
          error: error.message,
          totalFiles: 0,
          audioFiles: 0,
          fileNames: []
        });
      }

      console.log('\n=== FINAL RESULTS ===');
      console.log(`Total audio recordings found: ${allRecordings.length}`);
      allRecordings.forEach(recording => {
        console.log(`Recording: ${recording.name} | Path: ${recording.path}`);
      });

      // Store debug info for display in UI
      setDebugInfo(debugInfo);

      // Sort by modification time (newest first)
      allRecordings.sort((a, b) => new Date(b.modificationTime) - new Date(a.modificationTime));

      setRecordings(allRecordings);
    } catch (error) {
      console.log('Error in loadRecordings:', error);
      Alert.alert('Error', 'Failed to load recordings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const playRecording = (recording) => {
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      setCurrentSound(null);
      setPlayingId(null);
    }

    if (playingId === recording.id) {
      return;
    }

    const sound = new Sound(recording.path, '', (error) => {
      if (error) {
        Alert.alert('Error', 'Failed to load audio file: ' + error.message);
        return;
      }

      setCurrentSound(sound);
      setPlayingId(recording.id);

      sound.play((success) => {
        if (success) {
          console.log('Playback finished');
        } else {
          console.log('Playback failed');
        }
        setPlayingId(null);
        setCurrentSound(null);
        sound.release();
      });
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRecordingItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.recordingItem,
        playingId === item.id && styles.playingItem
      ]}
      onPress={() => playRecording(item)}
    >
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.recordingDetails}>
          {item.folder} • {formatFileSize(item.size)} • {formatDate(item.modificationTime)}
        </Text>
      </View>
      <View style={styles.playButton}>
        <Icon
          name={playingId === item.id ? 'stop' : 'play-arrow'}
          size={24}
          color={playingId === item.id ? '#ff4444' : '#007AFF'}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recordings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audio Recordings</Text>

      {recordings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="music-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No audio recordings found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadRecordings}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.countText}>
            {recordings.length} recording{recordings.length !== 1 ? 's' : ''} found
          </Text>
          <FlatList
            data={recordings}
            renderItem={renderRecordingItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.refreshButton} onPress={loadRecordings}>
            <Icon name="refresh" size={20} color="#007AFF" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  countText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recordingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  playingItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  recordingInfo: {
    flex: 1,
    marginRight: 12,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recordingDetails: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default App;













