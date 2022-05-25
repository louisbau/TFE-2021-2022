import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Text, SectionList, StatusBar, SafeAreaView, Image } from 'react-native';
import GroupItem from '../components/GroupItem';
import { API_URL } from "@env";
import CustomInput from '../components/CustomInput';
const API = API_URL

export default function GroupScreen() {
    const [group, setGroup] = useState([]);
    const [search, setSearch] = useState('');
    const [masterDataSource, setMasterDataSource] = useState([]);
    
    useFocusEffect(
        useCallback(() => {
            setSearch('')
            fetchGroup()
            return () => {
                setSearch('')
            };
        }, [])
    );
    const fetchGroup = async () => {
        fetch(`${API}/ChatRoom/listGroup`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setGroup(jsonRes);
                    setMasterDataSource(jsonRes)
                } else {
                    setGroup(jsonRes);
                    setMasterDataSource(jsonRes)
                    
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    
    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        console.log(text)
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setGroup(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setGroup(masterDataSource);
          setSearch(text);
        }
    };

    return (
        <SafeAreaView style={styles.container1}>
            <CustomInput placeholder='Search Here' value={search} setValue={searchFilterFunction} secureTextEntry={false}/>
            <FlatList 
                data={group}
                renderItem={({ item }) => <GroupItem group={item} setGroup={setGroup}/>}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    page: {
      backgroundColor: 'white',
      flex: 1
    },
    itemStyle: {
      padding: 10,
    },
    textInputStyle: {
      height: 40,
      borderWidth: 1,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#009688',
      backgroundColor: '#FFFFFF',
    },
    container1: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "white"
    },

    containerList: {
        flexDirection: 'row',
        padding: 10,
    },
    container: {
        flexDirection: 'column',
        padding: 10,
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
        marginRight: 10,
    },
    badgeContainer: {
        backgroundColor: '#3777f0',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 45,
        top: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 12
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 3,
    },
    text: {
        color: 'grey',
    }
});