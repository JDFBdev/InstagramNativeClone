import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Search({navigation}) {
    const [users, setUsers] = useState([]);

    const fetchUsers = function(search){
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
    
  return (
    <View>
      <TextInput onChangeText={(search) => fetchUsers(search)} placeholder='Search...' />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", {uid: item.id}) }
          >
            <Text style={{fontSize: 20}}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
