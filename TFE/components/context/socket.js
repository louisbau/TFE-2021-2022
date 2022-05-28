import socketio from "socket.io-client";
import React, { useState, useContext, useEffect, useRef, createContext } from 'react';
export const socket = socketio.connect("http://192.168.1.55:5000");
export const SocketContext = createContext();