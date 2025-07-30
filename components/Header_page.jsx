import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';


export default function Header_page({  title }) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <ChevronLeft size={25}  color="#fff" />
        </TouchableOpacity>

        <Text style={styles.profileTitle}>{title}</Text>

        <Image
          source={require('../assets/userImage.png')}
          style={styles.profileIcon}
        />
      </View>
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
  iconWrapper: {
    padding: 5,
  },
  profileTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'semibold',
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
});
