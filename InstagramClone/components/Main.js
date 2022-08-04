import React, { useEffect } from 'react';
import { View } from 'react-native';
import  { connect } from 'react-redux';
import { fetchUser } from '../redux/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import Feed from './main/Feed';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './main/Profile';

const EmptyScreen = () => {
    return(null);
}

function Main() {
    const Tab = createMaterialBottomTabNavigator();
    const currentUser = useSelector((state)=> state.currentUser);
    const dispatch = useDispatch();

    useEffect(()=>{
       dispatch(fetchUser())
    },[])

    if(!currentUser){
        return <View></View>
    }
    
    return (
            <Tab.Navigator initialRouteName='Feed' screenOptions={{headerShown: false}} labeled={false}>
                <Tab.Screen
                    name="Feed"
                    component={Feed}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={26} />
                        )
                    }}/>
                <Tab.Screen
                    listeners={({ navigation })=>({
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

export default connect(null, { fetchUser })(Main);