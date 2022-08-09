import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './components/auth/Landing';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers/index'
import thunk from 'redux-thunk';
import Main from './components/Main';
import Add from './components/main/Add';
import Save from './components/main/Save';
import Comment from './components/main/Comment';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const firebaseConfig = {
  apiKey: "AIzaSyDDONfjS8KO61yKyFw0lVgGXnC0p4OEpw8",
  authDomain: "instagramclone-e5587.firebaseapp.com",
  projectId: "instagramclone-e5587",
  storageBucket: "instagramclone-e5587.appspot.com",
  messagingSenderId: "802164169707",
  appId: "1:802164169707:web:f1c1f5bc2bd92ef23bd7ae"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const Stack = createNativeStackNavigator();

export default function App() {

  const [state, setState] = useState({loaded: false, loggedIn: false});

  useEffect(()=>{
    firebase.auth().onAuthStateChanged( (user) => {  // Listener de cambio de autenticacion de usuario
      if(!user){
        setState({loaded: true, loggedIn: false})
      } else {
        setState({loaded: true, loggedIn: true})
      }
    })
  },[])

  if(!state.loaded){  // Ponemos una pantalla de carga hasta que firebase nos responda
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text>Loading...</Text>
      </View>
    )
  }

  if(!state.loggedIn){  // Si no estamos logeados navegamos entre estas pantallas
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Landing' screenOptions={{headerShown: false}}>
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return(
    <Provider store={store}>
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Main' screenOptions={{headerShown: false}}>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="Save" component={Save} />
            <Stack.Screen name="Comment" component={Comment} />
          </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )

}
