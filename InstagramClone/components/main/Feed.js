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
  const feed = useSelector((state) => state.feed);

  useEffect(()=>{
    if(usersFollowingLoaded === following.length && following.length !== 0){  // Chequea que esten cargados todos los usuarios que sigue, se re-ejecuta cuando se cargan mas
      feed.sort(function(x,y){
        return x.creation - y.creation; // returns positive or negative
      })
      setPosts(feed);
    }
  },[usersFollowingLoaded, feed])

  // console.log(feed) 

  const onLikePress = function(userId, postId){
    firebase.firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({})
  }

  const onDislikePress = function(userId, postId){
    firebase.firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .delete()
  }

  if (posts.length == 0) {
    return (<View />)
  }

  return (
    <View style={s.container}>
      <View style={s.galleryContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts[0].posts}
          renderItem={({item}) => (
            <View style={s.postContainer}>
              <Text style={{fontSize: 20, flex: 1}}>{item.user.name}</Text>
              <Image style={s.image} source={{uri: item.downloadURL}} />
              {
                item.currentUserLike ?
                <Button title='Dislike' onPress={() => onDislikePress(item.user.uid, item.id)}/> :
                <Button title='Like' onPress={() => onLikePress(item.user.uid, item.id)}/>
              }
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