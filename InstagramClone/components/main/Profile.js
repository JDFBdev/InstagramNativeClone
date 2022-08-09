import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Profile({route}) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const posts = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.currentUser);
  const followingSelector = useSelector((state) => state.following);

  useEffect(()=>{

    if(route.params.uid === firebase.auth().currentUser.uid){

      setUser(currentUser);
      setUserPosts(posts);

    } else {

      firebase.firestore()
      .collection('users')
      .doc(route.params.uid)
      .get()
      .then((snapshot)=>{
        if(snapshot.exists){
          let data = snapshot.data();
          setUser(data);
        } else {
            console.log('User does not exist')
        }
      })

      firebase.firestore()
      .collection('posts')
      .doc(route.params.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot)=>{
          let posts = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data }
          })
          setUserPosts(posts);
      })

    }

    if(followingSelector.indexOf(route.params.uid) > -1){
      setFollowing(true);
    } else {
      setFollowing(false);
    }

  },[route.params.uid, followingSelector])

  const onFollow = function(){
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(route.params.uid)
    .set({})
  }

  const onUnfollow = function(){
    firebase.firestore()
    .collection('following')
    .doc(firebase.auth().currentUser.uid)
    .collection('userFollowing')
    .doc(route.params.uid)
    .delete()
  }

  const onLogout = function(){
    firebase.auth().signOut();
  }

  if(user === null){
    return <View/>
  }

  return (
    <View style={s.container}>
      <View style={s.userInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {
          route.params.uid !== firebase.auth().currentUser.uid ? (
            <View>
              {
                following ? 
                <Button title='Following' onPress={onUnfollow} /> : 
                <Button title='Follow' onPress={onFollow} />
              }
            </View>
          ) : 
          <Button title='Logout' onPress={onLogout}/>
        }
      </View>
      <View style={s.galleryContainer}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({item}) => (
            <View style={s.imageContainer}>
              <Image style={s.image} source={{uri: item.downloadURL}} />
            </View>
          )}
        />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1
  },
  userInfo: {

  },
  galleryContainer: {
    flex: 1
  },
  imageContainer: {
    flex: 1/3
  },
  image: {
    flex: 1,
    aspectRatio: 1/1
  }
});