import socketio from "socket.io-client";
import React, { useState, useContext, useEffect, useRef, createContext } from 'react';
export const socket = socketio.connect("http://checkpcs.com:5000");
export const SocketContext = createContext();