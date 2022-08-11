import React, { useState } from 'react';
import { Text, View, TextInput, StatusBar, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import InstagramLogo from '../../assets/instagramText.png';

const widthvw = Dimensions.get('window').width; //full width
const heightvh = Dimensions.get('window').height; //full height

export default function Register({navigation}) {
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
        <View style={s.container}>
        <StatusBar/>
        <View style={s.content}>
            <Image source={InstagramLogo} style={s.instagramLogo} />
            <TextInput
                placeholderTextColor={'white'}
                style={s.input}
                placeholder='Name'
                onChangeText={(name)=>{setInputs((prev)=>({...prev, name}))}}
            />
            <TextInput
                placeholderTextColor={'white'}
                style={s.input}
                placeholder='Email'
                onChangeText={(email)=>{setInputs((prev)=>({...prev, email}))}}
            />
            <TextInput
                placeholderTextColor={'white'}
                style={s.input}
                placeholder='Password'
                onChangeText={(password)=>{setInputs((prev)=>({...prev, password}))}}
            />
            <TouchableOpacity onPress={onSignUp}>
                <View style={s.logInBtn}>
                    <Text style={s.logInBtnText}>Sign Up</Text>
                </View>
            </TouchableOpacity>
            <View style={s.registerContainer}>
                <Text style={s.registerLabel}>Have an account already?</Text>
                <Text style={s.registerBtn} onPress={()=> navigation.navigate('Login')}> Log In</Text>
            </View>
        </View>
    </View>
    )

}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instagramLogo: {
        width: 212,
        height: 60,
        marginBottom: 15
    },
    input: {
        backgroundColor: '#2F2F2F',
        width: widthvw / 5 * 4,
        height: 50,
        borderRadius: 6,
        marginBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'white'
    },
    logInBtn: {
        width: widthvw / 5 * 4,
        height: 45,
        backgroundColor: '#366efc',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logInBtnText: {
        color: '#ffffff',
        fontSize: 19,
        fontWeight: '500'
    },
    registerContainer: {
        marginTop: 10,
        flexDirection: 'row'
    },
    registerLabel: {
        color: '#ADADAD',
        fontSize: 14
    },
    registerBtn: {
        color: '#366efc',
        fontWeight: '500',
        fontSize: 14
    }

})