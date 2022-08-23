import React, { useEffect } from 'react';
import { View } from 'react-native';
import  { connect } from 'react-redux';
import { clearData, fetchUser, fetchUserFollowing, fetchUserPosts } from '../redux/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import Feed from './main/Feed';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './main/Profile';
import Search from './main/Search';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const EmptyScreen = () => {
    return(null);
}

function Main() {
    const Tab = createMaterialBottomTabNavigator();
    const currentUser = useSelector((state)=> state.currentUser);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(clearData());
        dispatch(fetchUser());
        dispatch(fetchUserPosts());
        dispatch(fetchUserFollowing());
    },[])

    if(!currentUser){
        return <View style={{flex: 1, backgroundColor: '#000000'}}/>
    }
    
    return (
            <Tab.Navigator initialRouteName='Feed' screenOptions={{headerShown: false, tabBarColor: '#000000'}} labeled={false} >
                <Tab.Screen
                    name="Feed"
                    component={Feed}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={26} />
                        )
                    }}/>
                <Tab.Screen
                    name="Search"
                    component={Search}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='magnify' color={color} size={26} />
                        )
                    }}/>
                <Tab.Screen
                    listeners={({ navigation })=>({ // Listener a navigation en esta pagina, redireccionamos a Add
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Add')
                        }
                    })}
                    name="AddContainer"
                    component={EmptyScreen}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='plus-box' color={color} size={26} />
                        )
                    }}/>
                <Tab.Screen
                    listeners={({ navigation })=>({ // Listener a navigation en esta pagina, redireccionamos a Profile, con parametro uid
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Profile', {uid: firebase.auth().currentUser.uid})
                        }
                    })}
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='account-circle' color={color} size={26} />
                        )
                    }}/>
            </Tab.Navigator>
    )
}

export default connect(null, { fetchUser, fetchUserPosts, fetchUserFollowing, clearData })(Main);
