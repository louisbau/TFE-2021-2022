import React, { useState, useEffect } from 'react';

import { View, StyleSheet, FlatList, Platform } from 'react-native';
import UserItem from '../components/UserItem';
const API_URL = Platform.OS === 'ios' ? 'http://172.20.10.5:5000/api' : 'http://172.20.10.5:5000/api';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
        fetch(`${API_URL}/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setUsers(jsonRes.message);
                } else {
                    setUsers(jsonRes.message);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    fetchUsers();
  }, [])

  return (
    <View style={styles.page}>
       <FlatList 
        data={users}
        renderItem={({ item }) => <UserItem user={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
  }
});