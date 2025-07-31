import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import Header from '../components/Header';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';


const dummyTickets = [
  {
    id: 'ID23456',
    title: 'Frontend Developer',
    location: 'Infosys - Trivandrum',
    openings: 24,
    profileImage: require('../assets/userImage.png'),
  },
  {
    id: 'ID23456',
    title: 'Ui/UX Designer',
    location: 'Infosys - Trivandrum',
    openings: 24,
    profileImage: require('../assets/userImage.png'),
  },
  {
    id: 'ID23456',
    title: 'Tester',
    location: 'Infosys - Trivandrum',
    openings: 24,
    profileImage: require('../assets/userImage.png'),
  },
];

export default function TicketsPage() {
   const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <View style={styles.bodyContainer}>

          <View style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <TextInput
              placeholder="Search Tickets"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>

         
          <FlatList
            data={dummyTickets}
            keyExtractor={(item, index) => item.id + index}
            style={styles.flatlist}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable onPress={()=>navigation.navigate('Profile', { ticket: item })}>
              <View style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketTitle}>{item.title}</Text>
                  <Text style={styles.ticketId}>{item.id}</Text>
                </View>
                <View style={styles.ticketFooter}>
                  <View>
                    <Text style={styles.ticketSubText}>{item.location}</Text>
                    <Text style={styles.ticketSubText}>Opening - {item.openings}</Text>
                  </View>
                  <View style={styles.rightFooter}>
                    <Text style={styles.assignedText}>Assigned by</Text>
                    <Image source={item.profileImage} style={styles.profileImage} />

                  </View>

                </View>
              </View>
              </Pressable>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  bodyContainer: {
    paddingHorizontal: 20

  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#D9D9D980',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginTop: 16,
    marginBottom: 10,

  },
  searchIcon: {
    marginRight: 8,
    marginBottom: 5,
    color: '#838383'
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Satoshi-Regular',
    color: '#111827',
  },
  flatlist: {
    marginTop: 4,
    padding: 4

  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0380C7',
    fontFamily: 'Satoshi-Bold'
  },
  ticketId: {
    fontSize: 12,
    color: '#6E707A',
    fontFamily: 'Satoshi-Regular'
  },
  ticketSubText: {
    fontSize: 14,
    color: '#183B56',
    marginBottom: 2,
    fontFamily: 'Satoshi-Regular'
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  assignedText: {
    fontSize: 13,
    color: '#183B56',
    fontFamily: 'Satoshi-Regular',
    fontWeight:'semibold'
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  rightFooter:{
    gap:4,
    flex:'col',
    alignItems:'flex-end'
  }
});
