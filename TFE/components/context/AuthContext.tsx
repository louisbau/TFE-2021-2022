import React, { useState, useContext, useEffect, useRef, createContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const isSign = async () => { 
    const t = await SecureStore.getItemAsync('token')
    if (t !== null) {
        return true
    }
    else {
        return false
    }
}
export const isSigned = isSign() !== null ? true : false
export const AuthContext = createContext();