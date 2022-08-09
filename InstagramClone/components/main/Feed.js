import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default function Feed({navigation}) {
  const [posts, setPosts] = useState([]);

  const users = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.currentUser);
  const following = useSelector((state) => state.following);
  const usersFollowingLoaded = useSelector((state) => state.usersFollowingLoaded);

  useEffect(()=>{
    let posts = [];
    if(usersFollowingLoaded === following.length){  // Chequea que esten cargados todos los usuarios que sigue, se re-ejecuta cuando se cargan mas
      for(let i = 0; i < following.length; i++){
        const user = users.find(el => el.uid === following[i]);  // Buscamos el usuario por uid almacenado en following
        if(user != undefined){
          posts = [...posts, user.posts]
        }
      }

      posts.sort(function(x,y){
        return x.creation - y.creation; // returns positive or negative
      })

      setPosts(posts);

    }

  },[usersFollowingLoaded])

  if (posts.length == 0) {
    return (<View />)
  }

  return (
    <View style={s.container}>
      <View style={s.galleryContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts[0]}
          renderItem={({item}) => (
            <View style={s.postContainer}>
              <Text style={{fontSize: 20, flex: 1}}>{item.user.name}</Text>
              <Image style={s.image} source={{uri: item.downloadURL}} />
              <Text onPress={()=> navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})}>View Comments...</Text>
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
  postContainer: {
    flex: 1
  },
  image: {
    aspectRatio: 1/1
  }
});