import React, { useState } from 'react';
import { Text, View, TextInput, StatusBar, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import InstagramLogo from '../../assets/instagramText.png';
import Toast from 'react-native-root-toast';

const widthvw = Dimensions.get('window').width; //full width
const heightvh = Dimensions.get('window').height; //full height

export default function Login({navigation}) {
    const [inputs, setInputs] = useState({email: '', password: ''});

    const onSignIn = function(){
        const { email, password } = inputs;

        if(email === ''){
            Toast.show('Email is required', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                backgroundColor: '#f76077',
                animation: true,
            });
        }

        if(password === ''){
            Toast.show('Password is required', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                backgroundColor: '#f76077',
                animation: true,
            });
        }

        if(inputs.email !== '' && password !== ''){

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result)=>{
                console.log('Logged In');
            })
            .catch((e)=>{
                var errorCode = e.code;
                if (errorCode === 'auth/wrong-password') {
                    Toast.show('Wrong password', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        backgroundColor: '#f76077',
                        animation: true,
                    });
                }
                if (errorCode === 'auth/invalid-email') {
                    Toast.show('Invalid email', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        backgroundColor: '#f76077',
                        animation: true,
                    });
                }
                if (errorCode === 'auth/user-not-found') {
                    Toast.show('User not found', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        backgroundColor: '#f76077',
                        animation: true,
                    });
                }
            })
        }
    }

  return (
    <View style={s.container}>
        <StatusBar/>
        <View style={s.content}>
            <Image source={InstagramLogo} style={s.instagramLogo} />
            <TextInput
                placeholderTextColor={'white'}
                style={s.input}
                placeholder='Email'
                onChangeText={(email)=>{setInputs((prev)=>({...prev, email}))}}
            />
            <TextInput
                secureTextEntry={true}
                placeholderTextColor={'white'}
                style={s.input}
                placeholder='Password'
                onChangeText={(password)=>{setInputs((prev)=>({...prev, password}))}}
            />
            <TouchableOpacity onPress={onSignIn}>
                <View style={s.logInBtn}>
                    <Text style={s.logInBtnText}>Log In</Text>
                </View>
            </TouchableOpacity>
            <View style={s.registerContainer}>
                <Text style={s.registerLabel}>Don't have an account?</Text>
                <Text style={s.registerBtn} onPress={()=> navigation.navigate('Register')}> Sign Up</Text>
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