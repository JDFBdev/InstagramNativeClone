import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Post({route, navigation}) {
  const [currentUserLike, setCurrentUserLike] = useState(false);
  const {post, user} = route.params;

  useEffect(()=>{
    let isMounted = true;

    firebase.firestore()
    .collection("posts")
    .doc(user.uid)
    .collection("userPosts")
    .doc(post.id)
    .collection("likes")
    .doc(firebase.auth().currentUser.uid)
    .onSnapshot((snapshot) => {

      if(snapshot.exists){
        if(isMounted){
          setCurrentUserLike(true);
        }
      }

    })

    return () => { isMounted = false };
    
  },[])

  const onLikePress = function(userId, postId){
    firebase.firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({})

      setCurrentUserLike(true);
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

    setCurrentUserLike(false);
  }

  const handleShare =  async function(downloadURL){

  }

  return (
    <View style={s.container}>
      <View style={s.postContainer}>
        <View style={s.postHeader}>
          {
            user.profilePicture !== undefined ? 
            <Image style={s.profilePicture} source={{uri: user.profilePicture}}/> :
            <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={32}/>
          }
          <Text style={[s.userName, {marginLeft: 8}]}>{user.name}</Text>
        </View>
        <Image style={s.image} source={{uri: post.downloadURL}} />
        <View style={s.postBottom}>
          <View style={s.icons}>
            {
              currentUserLike ?
              <TouchableOpacity onPress={() => onDislikePress(user.uid, post.id)}>
                <MaterialCommunityIcons name='cards-heart' color={'#ED4956'} size={32}/>
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => onLikePress(user.uid, post.id)}>
                <MaterialCommunityIcons name='cards-heart-outline' color={'#ffffff'} size={30}/>
              </TouchableOpacity>
            }
            <MaterialCommunityIcons name='chat-outline' color={'#ffffff'} size={30} style={s.icon} onPress={()=> navigation.navigate('Comment', {postId: post.id, uid: user.uid, caption: post.caption, username: user.name})}/>
            <MaterialCommunityIcons name='send' color={'#ffffff'} size={30} style={s.icon} onPress={()=> { handleShare(item.downloadURL) }}/>
          </View>
          <Text style={s.userName}>{user.name}</Text>
          <Text style={s.caption}>{post.caption}</Text>
          <Text style={s.viewComments} onPress={()=> navigation.navigate('Comment', {postId: post.id, uid: user.uid, caption: post.caption, username: user.name})}>View Comments...</Text>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  postContainer: {
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
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  image: {
    aspectRatio: 1/1
  },
  postBottom: {
    backgroundColor: '#000000',
    paddingLeft: 10
  },
  icons: {
    marginTop: 5,
    flexDirection: 'row'
  },
  icon: {
    marginLeft: 12
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