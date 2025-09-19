import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../Context/userContext";
import api from "../services/api";

export default function SettingsModal({ visible, onClose, currentFolder, onSave }) {
  const [folderInput, setFolderInput] = useState(currentFolder || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useUser();
  const userId = user?.user_id;


  const getRecordingFolder = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await api.get(`/api/getfolder/${userId}`);
      console.log(response);
      

      const folderPath = response.data.folder_path;
      if (folderPath) {
        setFolderInput(folderPath);
      }
    } catch (err) {
      console.error("❌ Error fetching folder:", err.response?.data || err.message);
    }
  }, [userId]);

  
  const setRecordingFolder = useCallback(
    async (path) => {
      if (!userId) return;

      try {
        const response = await api.post(
          "/api/postfolder/",
          { user_id: userId, folder_path: path },
          { headers: { "Content-Type": "application/json" } }
        );
      
        
        return response.data;
      } catch (err) {
        console.error("❌ Error setting folder:", err.response?.data || err.message);
        throw err;
      }
    },
    [userId]
  );

  // ✅ Handle save button
  const handleSave = useCallback(async () => {
    if (!folderInput) {
      setError("Folder path cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await setRecordingFolder(folderInput);
      onSave(folderInput);
      onClose();
    } catch (err) {
      setError("Failed to save folder. Try again.");
    } finally {
      setLoading(false);
    }
  }, [folderInput, setRecordingFolder, onSave, onClose]);

  // ✅ Sync current folder & fetch from backend on open
  useEffect(() => {
    if (visible) {
      setFolderInput(currentFolder || "");
      getRecordingFolder();
    }
  }, [visible, currentFolder, getRecordingFolder]);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
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

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save</Text>}
          </TouchableOpacity>

          <Text style={styles.currentText}>Paste your recording folder directory here</Text>
          <Text style={styles.currentText2}>e.g. Recordings/Call</Text>
          <Text style={styles.currentText3}>Current Path: {folderInput || "Not set"}</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "Satoshi-Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontFamily: "Satoshi-Regular",
  },
  saveBtn: {
    backgroundColor: "#0380C7",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Satoshi-Regular",
  },
  currentText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Satoshi-Regular",
  },
  currentText2: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    fontFamily: "Satoshi-Regular",
  },
  currentText3: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 10,
    fontFamily: "Satoshi-Regular",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 5,
    textAlign: "center",
  },
});
