import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { Feather } from '@expo/vector-icons'; 

const CustomFeather = ({ name, size, onPress, color }) => {
    return (
        <Pressable
            onPress={onPress}
            style={styles.container}
          >
            <Feather
              name={name}
              size={size}
              color={color}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container : {
        width: 'auto',
    }
});

export default CustomFeather;