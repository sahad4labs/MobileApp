import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Search, PhoneCall, ScanQrCode } from 'lucide-react-native';
import RNFS from 'react-native-fs';
import Layout from './Layout';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const { CallModule } = NativeModules;
const RECORDINGS_FOLDER = '/storage/emulated/0/Recordings/Call';

export default function ProfilePage() {
  const route = useRoute();
  const { ticket } = route.params;
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get(`/api/getprofiles/${ticket.id}`);
        setProfiles(response.data.profiles);
        console.log(response.data.profiles);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        Alert.alert('Error', 'Failed to fetch tickets from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your call recordings',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your call recordings',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handleCall = async phoneNumber => {
    const granted = await requestStoragePermission();
    if (!granted) {
      console.log('❌ Storage permission denied');
      return;
    }

    console.log('📞 Calling:', phoneNumber);
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(err =>
      console.log('❌ Error opening call:', err),
    );

    const callEmitter = new NativeEventEmitter(CallModule);
    CallModule.startCallListener();

    const subscription = callEmitter.addListener('CallEnded', async () => {
      console.log('📴 Call ended detected!');

      try {
        const files = await RNFS.readDir(RECORDINGS_FOLDER);

        if (!files || files.length === 0) {
          console.log('⚠️ No recordings found in:', RECORDINGS_FOLDER);
        } else {
          let latestFile = files[0];
          files.forEach(f => {
            if (f.mtime && latestFile.mtime && f.mtime > latestFile.mtime) {
              latestFile = f;
            }
          });

          console.log('📂 Latest recording file:', latestFile.path);
        }
      } catch (err) {
        console.error('❌ Error reading recordings:', err);
      }

      subscription.remove();
      CallModule.stopCallListener();
    });
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
          onPress={() => handleCall(item?.phone)}
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
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#6B7280', fontSize: 16 }}>
              No profiles available
            </Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            keyExtractor={item => item.id}
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, flex: 1 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D980',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 5,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 8, marginBottom: 5, color: '#838383' },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  profileCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0380C7',
    fontFamily: 'Satoshi-Bold',
  },
  profileSub: {
    fontSize: 13,
    color: '#183B56',
    marginTop: 2,
    fontFamily: 'Satoshi-Regular',
  },
  callBtn: { backgroundColor: '#0380C7', padding: 10, borderRadius: 6 },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 48,
    backgroundColor: '#0380C7',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Satoshi-Bold',
  },
  flatList: { marginTop: 12 },
});
