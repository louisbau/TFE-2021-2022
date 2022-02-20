import * as React from 'react';

import { Text, Image, View, StyleSheet, FlatList } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';

import ChatRoomsData from '../assets/dummy-data/ChatRooms';



export default function TabOneScreen() {
  return (
    <View style={styles.page}>
      <FlatList 
        data={ChatRoomsData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item}/>}
        showsHorizontalScrollIndicator={false}
        // horizontal; allow horizental display (exemple stories)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex:1,
  },
})
