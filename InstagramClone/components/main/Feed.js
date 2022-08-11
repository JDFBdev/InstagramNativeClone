import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import InstagramLogo from '../../assets/instagramText.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Feed({navigation}) {
  const [posts, setPosts] = useState([]);
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
      <View style={{height: 50, backgroundColor: "#000000", padding: 10}}>
        <Image source={InstagramLogo} style={{width:106, height: 30}} />
      </View>
      <View style={s.galleryContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({item}) => (
            <View style={s.postContainer}>
              <View style={s.postHeader}>
                <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={32} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}} />
                <Text style={[s.userName, {marginLeft: 5}]} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}>{item.user.name}</Text>
              </View>
              <Image style={s.image} source={{uri: item.downloadURL}} />
              <View style={s.postBottom}>
                {
                  item.currentUserLike ?
                  <TouchableOpacity onPress={() => onDislikePress(item.user.uid, item.id)}>
                    <MaterialCommunityIcons name='cards-heart' color={'#ED4956'} size={32} style={{marginTop: 5}} />
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={() => onLikePress(item.user.uid, item.id)}>
                    <MaterialCommunityIcons name='cards-heart-outline' color={'#ffffff'} size={30}style={{marginTop: 5}} />
                  </TouchableOpacity>
                }
                <Text style={s.userName}>{item.user.name}</Text>
                <Text style={s.caption}>{item.caption}</Text>
                <Text style={s.viewComments} onPress={()=> navigation.navigate('Comment', {postId: item.id, uid: item.user.uid, caption: item.caption, username: item.user.name})}>View Comments...</Text>
              </View>
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
  postHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: '#000000'
  },
  galleryContainer: {
    flex: 1
  },
  postContainer: {
    flex: 1
  },
  image: {
    aspectRatio: 1/1
  },
  postBottom: {
    backgroundColor: '#000000',
    paddingLeft: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff'
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffffff'
  },
  viewComments: {
    color: '#cccccc',
    marginTop: 12,
    marginBottom: 8
  }
});