import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header(isprofilePage) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <Text style={styles.nameText}>Miss Lillie Lemke</Text>
          <Text style={styles.roleText}>Recruiter</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity>
            <Image
              source={require('../assets/userImage.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#0380C7', 
    paddingHorizontal: 23,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    paddingTop:50
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Satoshi-Regular',
    marginBottom: 2,
  },
  roleText: {
    color: '#D0D0D0',
    fontFamily:'Satoshi-Regular',
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.9,
  },
  rightSection: {
    alignItems: 'center',
  },
  profileImage: {
    width:60,
    height: 60,
    borderRadius: 50,
    resizeMode: 'contain',
  },
});