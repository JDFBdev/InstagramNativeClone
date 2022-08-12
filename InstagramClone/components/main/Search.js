import React, { useState } from 'react';
import { View, Text, Image, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Search({navigation}) {
    const [users, setUsers] = useState([]);

    const fetchUsers = function(search){
      if(search === ''){
        setUsers([]);
      } else {
        firebase.firestore()
        .collection('users')
        .where('name', '>=', search)
        .get()
        .then((snaphot) => {
            let users = snaphot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            });
            setUsers(users);
        })
      }
    }
    
  return (
    <View style={s.container}>
      <View style={s.inputContainer}>
        <MaterialCommunityIcons style={s.icon} name='magnify' color={'white'} size={26} />
        <TextInput style={s.input} placeholderTextColor='white' onChangeText={(search) => fetchUsers(search)} placeholder='Search...' />
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate("Profile", {uid: item.id}) }>
            <View style={s.userContainer}>
              {
                item.profilePicture ?
                <Image source={{uri: item.profilePicture}} style={s.profilePicture}/> :
                <MaterialCommunityIcons name='account-circle' color={'white'} size={40} />
              }
              <Text style={s.userName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  container:{
    backgroundColor: '#000000',
    flex: 1,
    padding: 10
  },
  inputContainer: {
    padding: 10,
    paddingLeft: 0,
    paddingRight: 0
  },
  icon: {
    position: 'absolute',
    zIndex: 10,
    marginTop: 17,
    marginLeft: 9
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  input: {
    color: 'white',
    backgroundColor: '#3D3D3D',
    height: 40,
    borderRadius: 10,
    paddingLeft: 40
  },
  userContainer: {
    borderWidth: 1,
    borderTopColor: '#3D3D3D',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName:{
    color: 'white',
    fontSize: 18,
    marginLeft: 10
  }
})
