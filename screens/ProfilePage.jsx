import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
  NativeModules,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Search, PhoneCall, ScanQrCode } from "lucide-react-native";
import RNFS from "react-native-fs";
import Layout from "./Layout";
import api from "../services/api";
import { useUser } from "../Context/userContext";
import mime from "mime";

const { CallModule } = NativeModules;
const RECORDINGS_FOLDER = "/storage/emulated/0/Recordings/Call";

export default function ProfilePage() {
  const route = useRoute();
  const { ticket } = route.params;
   const { setActiveProfileId, setActiveTicketId,activeProfileId, activeTicketId } = useUser();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get(`/api/getprofiles/${ticket.id}`);
        setProfiles(response.data.profiles);
        console.log(response.data.profiles);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        Alert.alert("Error", "Failed to fetch tickets from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const uploadRecording = async (ticketId, profileId, filePath) => {
  try {
    const formData = new FormData();
    formData.append("ticket_id", ticketId);
    formData.append("profile_id", profileId);
    formData.append("file", {
      uri: "file://" + filePath,       
      name: filePath.split("/").pop(),
      type: mime.getType(filePath)
    });

    const response = await api.post("/api/postrecord/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(" Upload success:", response.data);
  } catch (err) {
    console.error(" Upload failed:", err.response?.data || err.message);
  }
};

 useEffect(() => {
  const emitter = new NativeEventEmitter();
  CallModule.startCallListener();

  const sub = emitter.addListener("CallEnded", async () => {
    console.log("📴 Call ended! Ticket:", activeTicketId, "Profile:", activeProfileId);

    try {
      const files = await RNFS.readDir(RECORDINGS_FOLDER);

      if (!files || files.length === 0) {
        console.log(" No recordings found in:", RECORDINGS_FOLDER);
      } else {
        let latestFile = files[0];
        files.forEach((f) => {
          if (f.mtime && latestFile.mtime && f.mtime > latestFile.mtime) {
            latestFile = f;
          }
        });

        console.log(" Latest recording file:", latestFile.path);

     
        await uploadRecording(activeTicketId, activeProfileId, latestFile.path);
      }
    } catch (err) {
      console.error(" Error reading recordings:", err);
    }
  });

  return () => {
    sub.remove();
    CallModule.stopCallListener();
  };
}, [activeProfileId, activeTicketId]);

  const requestAllPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      let results = {};

      if (Platform.Version >= 33) {
        results.audio = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          {
            title: "Audio Permission",
            message: "App needs access to your call recordings",
            buttonPositive: "OK",
          }
        );
      } else {
        results.audio = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to your call recordings",
            buttonPositive: "OK",
          }
        );
      }

      results.phone = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "Phone Permission",
          message: "App needs access to detect calls",
          buttonPositive: "OK",
        }
      );

      results.callLog = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: "Call Log Permission",
          message: "App needs access to confirm missed/ended calls",
          buttonPositive: "OK",
        }
      );

      const allGranted = Object.values(results).every(
        (r) => r === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn(" Some permissions denied:", results);
      }

      return allGranted;
    } catch (err) {
      console.warn(" Permission error:", err);
      return false;
    }
  };

  const handleCall = async (phoneNumber,profileId) => {
    const granted = await requestAllPermissions();
    if (!granted) {
      console.log(" Storage permission denied");
      return;
    }
    setActiveProfileId(profileId)
    setActiveTicketId(ticket.id)

    console.log("📞 Calling:", phoneNumber, "Profile:", profileId, "Ticket:", ticket.id);
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      console.log("Error opening call:", err)
    );
  };

  const renderProfile = ({ item }) => {
    return (
      <View style={styles.profileCard}>
        <View>
          <Text style={styles.profileName}>{item?.name}</Text>
          <Text style={styles.profileSub}>
            {item?.parsed?.role} | {item?.parsed?.years_of_experience}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => handleCall(item?.phone,item?.id)}
        >
          <PhoneCall size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <Layout headerProps={{ title: ticket.title, showBack: true }}>
        <ActivityIndicator size="large" color="#0380C7" />
      </Layout>
    );
  }

  return (
    <Layout headerProps={{ title: ticket.title, showBack: true }}>
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Profiles"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {profiles.length === 0 ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ color: "#6B7280", fontSize: 16 }}>
              No profiles available
            </Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={(item) => item.id}
            renderItem={renderProfile}
            contentContainerStyle={{ paddingBottom: 90 }}
            style={styles.flatList}
          />
        )}
      </View>

      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan to Call</Text>
        <ScanQrCode size={18} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </Layout>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, flex: 1 },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D980",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 5,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 8, marginBottom: 5, color: "#838383" },
  searchInput: { flex: 1, fontSize: 15, color: "#111827" },
  profileCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 18,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0380C7",
    fontFamily: "Satoshi-Bold",
  },
  profileSub: {
    fontSize: 13,
    color: "#183B56",
    marginTop: 2,
    fontFamily: "Satoshi-Regular",
  },
  callBtn: { backgroundColor: "#0380C7", padding: 10, borderRadius: 6 },
  scanButton: {
    position: "absolute",
    bottom: 70,
    left: 20,
    right: 20,
    height: 48,
    backgroundColor: "#0380C7",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Satoshi-Bold",
  },
  flatList: { marginTop: 12 },
});
