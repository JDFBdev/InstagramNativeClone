import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const widthvw = Dimensions.get('window').width; //full width

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
      <View style={s.header}>
        <View style={s.userInfo}>
          <Text style={s.userName} >{user.name}</Text>
          <MaterialCommunityIcons style={s.profilePicture} name='account-circle' color={'#ffffff'} size={90} />
        </View>
        <View style={s.userStats}>
          <View style={s.userStat}>
            <Text style={[s.userStatText, {fontWeight: '500', fontSize: 20}]}>{posts.length}</Text>
            <Text style={s.userStatText}>Publicaciones</Text>
          </View>
          <View style={{width: 15}}/>
          <View style={s.userStat}>
            <Text style={[s.userStatText, {fontWeight: '500', fontSize: 20}]}>2</Text>
            <Text style={s.userStatText}>Seguidores</Text>
          </View>
          <View style={{width: 15}}/>
          <View style={s.userStat}>
            <Text style={[s.userStatText, {fontWeight: '500', fontSize: 20}]}>2</Text>
            <Text style={s.userStatText}>Seguidos</Text>
          </View>
        </View>
        {
          route.params.uid !== firebase.auth().currentUser.uid ? (
            <View>
              {
                following ? 
                <Button title='Following' onPress={onUnfollow} /> : 
                <Button title='Follow' onPress={onFollow} />
              }
            </View>
          ) : null
          // <Button title='Logout' onPress={onLogout}/>
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
    flex: 1,
    backgroundColor: '#000000'
  },
  header: {
    height: 160,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    width: widthvw / 5
  },
  userName: {
    color: '#ffffff',
    fontSize: 25
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: (widthvw / 5) * 4
  },
  userStat: {
    alignItems: 'center',
  },
  userStatText: {
    color: 'white'
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