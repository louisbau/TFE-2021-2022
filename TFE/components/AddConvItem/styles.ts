import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 10,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 30,
      marginRight: 10,
    },
    badgeContainer: {
      backgroundColor : '#3872E9',
      width:20,
      height:20,
      borderRadius: 10,
      justifyContent:'center',
      alignItems: 'center',
      position: 'absolute',
      borderColor:'white',
      borderWidth:1,
      left: 45,
      top : 10,
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
    },
    rightContainer: {
      flex: 1,
      // backgroundColor:'red',
      justifyContent:'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    name: {
      fontWeight: 'bold',
      color: 'green',
      fontSize: 18,
      marginBottom: 3,
    },
    text: { 
      color: 'grey',
    }
})

export default styles;