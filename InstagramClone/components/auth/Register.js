import React, { useState } from 'react';
import { View, Button, TextInput, StatusBar } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Register() {
    const [inputs, setInputs] = useState({email: '', password: '', name: ''});

    const onSignUp = function(){
        const { email, password, name } = inputs;
        firebase.auth().createUserWithEmailAndPassword(email, password)  // Creamos el usuario
            .then((result)=>{
                firebase.firestore().collection('users')       // De la tabla de users
                    .doc(firebase.auth().currentUser.uid)      // apuntamos a un doc con el userid que acabamos de crear
                    .set({ name, email })                      // Seteamos los valores en la tabla
            })
            .catch((e)=>{
                console.log(e);
            })
    }

  return (
    <View>
        <StatusBar/>
        <TextInput
            placeholder='Name'
            onChangeText={(name)=>{setInputs((prev)=>({...prev, name}))}}
        />
        <TextInput
            placeholder='Email'
            onChangeText={(email)=>{setInputs((prev)=>({...prev, email}))}}
        />
        <TextInput
            placeholder='Password'
            onChangeText={(password)=>{setInputs((prev)=>({...prev, password}))}}
        />
        <Button
            onPress={onSignUp}
            title='Sign Up'
        />
    </View>
  )
}

