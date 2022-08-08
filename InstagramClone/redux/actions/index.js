import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from '../constants/index';

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
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, payload: following});
                for(let i = 0; i<following.length; i++){
                    dispatch(fetchUsersData(following[i]));
                }
            })
    })
}

export function fetchUsersData(uid){
    return((dispatch, getState)=>{
        const found = getState().users.some(el => el.uid === uid); // Checkeamos si el usuario ya esta cargado en el estado. Si no esta, lo buscamos
        if(!found){
            firebase.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then((snapshot)=>{
                
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.uid;
                    dispatch({type: USERS_DATA_STATE_CHANGE, payload: user});
                    dispatch(fetchUsersFollowingPosts(user.id));
                } else {
                    console.log('User does not exist')
                }
            })
        }
    })
}

export function fetchUsersFollowingPosts(uid){
    return((dispatch, getState)=>{
        firebase.firestore()
            .collection('posts')
            .doc(uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot)=>{
                const uid = snapshot.docs[0].ref.path.split('/')[1];
                const user = getState().users.find(el => el.uid === uid)

                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, user, ...data }
                })
                dispatch({type: USERS_POSTS_STATE_CHANGE, payload: {posts: posts, uid: uid}})
                console.log(getState())
            })
    })
}

