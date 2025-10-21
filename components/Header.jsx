import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useUser } from '../Context/userContext';
import SettingsModal from './SettingsModal';

export default function Header({
  title,
  showBack = false,
  isProfilePage = false,
}) {
  const navigation = useNavigation();
  const { user, loading, logout } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [recordingsFolder, setRecordingsFolder] = useState("/storage/emulated/0/Recordings/Call");

  console.log(user);

  const handleLogout = async () => {
    setModalVisible(false);
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.headerWrapper}>
      {isProfilePage ? (
        <View style={styles.profileContainer}>
          <View style={styles.leftSection}>
            <Text style={styles.nameText}>{user?.name || 'User'}</Text>
            <Text style={styles.roleText}>
              {user?.role?.join(' | ') || 'Role'}
            </Text>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={user?.profile_pic || require('../assets/userImage.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          {showBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconWrapper}
            >
              <ChevronLeft size={25} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.profileTitle}>{title}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={require('../assets/userImage.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
         <View style={styles.dropdown}>

  <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
    <Text style={styles.dropdownText}>Logout</Text>
  </TouchableOpacity>

   <TouchableOpacity onPress={()=>{setSettingsVisible(true)
    setModalVisible(false)}} style={styles.dropdownItem}>
    <Text style={styles.dropdownText}>Settings</Text>
  </TouchableOpacity>


  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.dropdownItem}>
    <Text style={styles.dropdownTextClose}>Close</Text>
  </TouchableOpacity>

 
</View>

        </Pressable>
      </Modal>

      <SettingsModal
  visible={settingsVisible}
  onClose={() => setSettingsVisible(false)}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0380C7',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: { flex: 1, alignItems: 'flex-start' },
  rightSection: { alignItems: 'center' },
  iconWrapper: { padding: 5 },
  profileTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Satoshi-Regular',
  },
  nameText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Satoshi-Regular',
  },
  roleText: { color: '#D0D0D0', fontSize: 14 },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: 'contain',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  dropdown: {
  position: "absolute",
  top: 125, 
  right: 10,
  backgroundColor: "#fff",
  borderRadius: 8,
  overflow: "hidden",
  elevation: 0, 
},

dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#eee", 
},

dropdownText: {
  fontSize: 16,
  color: "#183B56",
  textAlign: "center",
  fontWeight: "700",
  fontFamily:'Satoshi-Regular'
},

dropdownTextClose: {
  fontSize: 16,
  color: "#888",
  textAlign: "center",
  fontWeight: "400",
  borderBottomWidth: 0, 
}

});
