import React, { createContext } from 'react'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from 'react-native-dotenv'
export const AppContext = createContext();
const API = "https://checkpcs.com/api"

class AppContextProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      app: [],
      message: [],
      user: {},
      userList: [],
      chatRoomId:"",
      UserId: "",
      search: []
    }
    this.readGlobale(),
    this.readUser()
  }

  // read
  async readGlobale() {
    
    
    axios.get(`http://192.168.1.55:5000/api/ChatRoom/listPrivateConv`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
          'credentials': 'include'
        }
    })
    .then((response) => { 
        const data = response.data
        this.setState({app: data})
        this.setState({search: data})
        //console.log(data)
        
    })
    .catch((err) => {
        console.log(err);
    });
  }
  async readAll(id) {
    
    axios.get(`${API}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
          'credentials': 'include'
        }
    })
    .then((response) => { 
        const data = response.data
        this.setState({userList: data})
        //console.log(data)
        
    })
    .catch((err) => {
        console.log(err);
    });
  }

  async readUser() {
    axios.get(`${API}/aller`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
          'credentials': 'include'
        }
    })
    .then((response) => { 
        const data = response.data
        this.setState({user: data[0]})
        // console.log(data)
    })
    .catch((err) => {
        console.log(err);
    });
  }
  

  async readMessage(id) {
    axios.get(`${API}/Message/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
        'credentials': 'include'
      }
    })
    .then((response) => { 
      const data = response.data
      this.setState({message: data})
      // console.log(data)
    })
    .catch((err) => {
        console.log('lol');
        console.log(err);
    });
  }

  SelectChatRoom(id) {
    this.setState({
      chatRoomId: id
    })
  }
  SelectUserID(id) {
    this.setState({
      UserId: id
    })
  }
  SetSearch(x) {
    this.setState({
      search: x
    })
  }
  cleanup() {
    this.setState({
      app: [],
      message: [],
      user: {},
      userList: [],
      chatRoomId:"",
      UserId: "",
      search: []
    })
  }

  render () {
    return (
      <AppContext.Provider value={{
        ...this.state,
        readGlobale: this.readGlobale.bind(this),
        readUser: this.readUser.bind(this),
        readMessage: this.readMessage.bind(this),
        readAll: this.readAll.bind(this),
        SelectChatRoom: this.SelectChatRoom.bind(this),
        SelectUserID: this.SelectUserID.bind(this),
        cleanup: this.cleanup.bind(this),
        SetSearch: this.SetSearch.bind(this)
      }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider