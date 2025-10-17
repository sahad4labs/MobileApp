import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import Layout from './Layout';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api'; 

export default function TicketsPage() {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/api/gettickets/'); 
        setTickets(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        Alert.alert('Error', 'Failed to fetch tickets from server');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets
  .filter(ticket => ticket.status === "created")  
  .filter(ticket =>
    ticket.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
       <Layout headerProps={{ isProfilePage: true }}>
        <ActivityIndicator size="large" color="#0380C7" />
      </Layout>
    );
  }

  return (
     <Layout headerProps={{ isProfilePage: true }}>
        <View style={styles.bodyContainer}>
          <View style={styles.searchWrapper}>
            <Search size={18} style={styles.searchIcon} />
            <TextInput
              placeholder="Search Tickets"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filteredTickets}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatlist}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('Profile', { ticket: item })}>
                <View style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTitle}>{item.title}</Text>
                    <Text style={styles.ticketId}>{item.serial_number}</Text>
                  </View>
                  <View style={styles.ticketFooter}>
                    <View>
                      <Text style={styles.ticketSubText}>{item?.client?.name}</Text>
                      <Text style={styles.ticketSubText}>Opening - {item.vacancy}</Text>
                    </View>
                    <View style={styles.rightFooter}>
                      <Text style={styles.assignedText}>Assigned by</Text>
                      {item.assigned_by?.profile_pic ? (
                        <Image
                          source={{ uri: item.assigned_by.profile_pic }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          source={require('../assets/userImage.png')}
                          style={styles.profileImage}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
    </Layout>
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
    flex:1,
    paddingHorizontal: 20,
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
    fontWeight:'600',
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
