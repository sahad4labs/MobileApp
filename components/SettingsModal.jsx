import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../Context/userContext';
import api from '../services/api';
export default function SettingsModal({ visible, onClose, onSave }) {
  const { user, setUser } = useUser();
  const userId = user?.userid;

  const [folderInput, setFolderInput] = useState(user?.folder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setFolderInput(user?.folder);
  }, [user?.folder]);

  const setRecordingFolder = useCallback(
    async path => {
      if (!userId) return;

      try {
        await api.post(
          '/api/postfolder/',
          { user_id: userId, folder_path: `/storage/emulated/0/${path}` },
          { headers: { 'Content-Type': 'application/json' } },
        );
        setUser(prev => ({ ...prev, folder: path }));
      } catch (err) {
        console.error(
          '❌ Error setting folder:',
          err.response?.data || err.message,
        );
        throw err;
      }
    },
    [userId, setUser],
  );

  const handleSave = useCallback(async () => {
    if (!folderInput) {
      setError('Folder path cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await setRecordingFolder(folderInput);
      onSave?.(folderInput);
      onClose();
    } catch (err) {
      setError('Failed to save folder. Try again.');
    } finally {
      setLoading(false);
    }
  }, [folderInput, setRecordingFolder, onClose, onSave]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.container}>
          <Text style={styles.title}>Set Recordings Folder</Text>
          <TextInput
            style={styles.input}
            value={folderInput}
            onChangeText={setFolderInput}
            placeholder="Enter folder path"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.currentText}>
            Paste your recording folder directory here
          </Text>
          <Text style={styles.currentText2}>e.g. Recordings/Call</Text>
          <Text style={styles.currentText3}>
            Current Path: {folderInput || 'Not set'}
          </Text>
        </View>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
  },
  saveBtn: {
    backgroundColor: '#0380C7',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
  },
  currentText: { fontSize: 12, color: '#555', fontFamily: 'Satoshi-Regular' },
  currentText2: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
  },
  currentText3: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10,
    fontFamily: 'Satoshi-Regular',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
  },
});
