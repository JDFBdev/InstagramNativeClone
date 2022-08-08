import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from '../constants/index';

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

export function fetchUserPosts(){
    return((dispatch)=>{
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot)=>{
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                dispatch({type: USER_POSTS_STATE_CHANGE, payload: posts})
            })
    })
}

export function fetchUserFollowing(){
    return((dispatch)=>{
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
            .onSnapshot((snapshot)=>{
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id;
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, payload: following})
            })
    })
}

