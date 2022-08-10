import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import  { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE } from '../constants/index';

export function clearData(){
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

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

export function fetchUserFollowing(){  // Fetch usuarios que seguimos
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

                for(let i = 0; i<following.length; i++){     // Por cada uno que seguimos, nos traemos su data
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    })
}

export function fetchUsersData(uid, getPosts){
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
                    user.uid = snapshot.id;
                    dispatch({type: USERS_DATA_STATE_CHANGE, payload: user});
                } else {
                    console.log('User does not exist')
                }
            })
            if(getPosts){
                dispatch(fetchUsersFollowingPosts(uid));  // Si se requiere, nos traemos su posts para el feed
            }
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

                for(let i = 0; i < posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id)) // El usuario uid likea el post posts[i].id
                }
                dispatch({type: USERS_POSTS_STATE_CHANGE, payload: {posts: posts, uid: uid}})
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId){
    return((dispatch, getState)=>{
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                const postId = snapshot.ref.path.split('/')[3];
                
                let currentUserLike = false;
                if(snapshot.exists){
                    currentUserLike = true;
                }

                dispatch({type: USERS_LIKES_STATE_CHANGE, payload: { postId: postId, currentUserLike: currentUserLike }})
            })
    })
}
