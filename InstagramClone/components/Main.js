import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import  { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser } from '../redux/actions/index';
import {useDispatch, useSelector} from 'react-redux';

function Main() {
    const dispatch = useDispatch();
    useEffect(()=>{
        fetchUser()
    },[])
  return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Text>Logged in!</Text>
        </View>
    )
}

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch);

export default connect(null, mapDispatchProps)(Main);