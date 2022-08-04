import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { USER_STATE_CHANGE } from '../constants/index';

export function fetchUser(){
    return((dispatch)=>{
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot)=>{
                
                if(snapshot.exists){
                    let data = snapshot.data();
                    dispatch({type: USER_STATE_CHANGE, payload: data})
                } else {
                    console.log('User does not exist')
                }
            })
    })
}