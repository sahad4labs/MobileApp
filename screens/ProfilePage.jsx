import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header_page from '../components/Header_page';
import { Search } from 'lucide-react-native';
import { PhoneCall, ScanQrCode } from 'lucide-react-native';

const dummyProfiles = [
  { id: 1, name: 'Johnnie Thompson', role: 'Frontend Developer', experience: '4 - 6 Years' },
  { id: 2, name: 'Miss Joy Blick', role: 'Frontend Developer', experience: '4 - 6 Years' },
  { id: 3, name: 'Ms. Alma Collins', role: 'Frontend Developer', experience: '4 - 6 Years' },
  { id: 4, name: 'Dr. Erick Hettinger', role: 'Frontend Developer', experience: '4 - 6 Years' },
  { id: 5, name: 'Kristie Nienow V', role: 'Frontend Developer', experience: '4 - 6 Years' },
];

export default function ProfilePage() {
  const route = useRoute();
  const { ticket } = route.params;

  const renderProfile = ({ item }) => (
    <View style={styles.profileCard}>
      <View>
        <Text style={styles.profileName}>{item.name}</Text>
        <Text style={styles.profileSub}>
          {item.role} | {item.experience}
        </Text>
      </View>
      <TouchableOpacity style={styles.callBtn}>
        <PhoneCall size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header_page isProfilePage title={ticket.title} />
      <View style={styles.container}>
     
        <View style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Profiles"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>


        <FlatList
          data={dummyProfiles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfile}
          contentContainerStyle={{ paddingBottom: 90 }}
          style={styles.flatList}
        />
      </View>

      <TouchableOpacity style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan to Call</Text>
        <ScanQrCode  size={18} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D980',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 5
    ,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
    marginBottom: 5,
    color: '#838383',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
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
    fontFamily:'Satoshi-Bold'
  },
  profileSub: {
    fontSize: 13,
    color: '#183B56',
    marginTop: 2,
    fontFamily:'Satoshi-Regular'
  },
  callBtn: {
    backgroundColor: '#0380C7',
    padding: 10,
    borderRadius: 6,
  },
  scanButton: {
    position: 'absolute',
    bottom: 70,
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
    fontFamily:'Satoshi-Bold'
  },
  flatList:{
    marginTop:12
  }
});
