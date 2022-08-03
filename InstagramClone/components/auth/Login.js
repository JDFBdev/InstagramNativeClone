import React, { useState } from 'react';
import { View, Button, TextInput, StatusBar } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export default function Login() {
    const [inputs, setInputs] = useState({email: '', password: ''});

    const onSignIn = function(){
        const { email, password, name } = inputs;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result)=>{
            console.log(result);
        })
        .catch((e)=>{
            console.log(e);
        })
    }

  return (
    <View>
        <StatusBar/>
        <TextInput
            placeholder='Email'
            onChangeText={(email)=>{setInputs((prev)=>({...prev, email}))}}
        />
        <TextInput
            placeholder='Password'
            onChangeText={(password)=>{setInputs((prev)=>({...prev, password}))}}
        />
        <Button
            onPress={onSignIn}
            title='Sign In'
        />
    </View>
  )
}

