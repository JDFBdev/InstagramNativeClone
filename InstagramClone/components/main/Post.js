import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';

export default function Post({route, postFeed, userFeed}) {
  const [currentUserLike, setCurrentUserLike] = useState(false);
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const navigation = useNavigation();

  useEffect(()=>{
    let isMounted = true;

    if(route === undefined){
      setPost(postFeed);
      setUser(userFeed);
    } else {
      setPost(route.params.post);
      setUser(route.params.user);
    }

    if(post.hasOwnProperty('currentUserLike')){
      setCurrentUserLike(post.currentUserLike)
    } else {
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
    }

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
  
  const handleShare = async function(downloadURL){
    await Clipboard.setStringAsync(downloadURL);
    let toast = Toast.show('Copied to clipboard', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      backgroundColor: '#636363',
      animation: true,
      hideOnPress: false,
      delay: 0,
    });
  }

  const handleDate = function(){

    let ahora = new Date();
    let horas = Math.floor((ahora - post.creation.toDate()) / 1000 / 60 / 60);
    let dias = Math.floor(horas/24)
    let semanas = Math.floor(dias/7)
    
    if(horas <= 23) return <Text style={s.date}>Hace {horas} horas</Text>

    if(horas >= 24 && horas <= 167) return <Text style={s.date}>Hace {dias} dias</Text>

    if(horas > 167 && semanas === 1) return <Text style={s.date}>Hace {semanas} semana</Text>

    if(horas > 167) return <Text style={s.date}>Hace {semanas} semanas</Text>

  }

  if(!post.creation){
    return <View/>
  }

  return (
    <View style={s.container}>
      <View style={s.postContainer}>
        <View style={s.postHeader}>
          {
            user.profilePicture !== undefined ? 
            <Image style={s.profilePicture} source={{uri: user.profilePicture}} onPress={()=>{navigation.navigate('Profile', {uid: user.uid})}}/> :
            <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={32} onPress={()=>{navigation.navigate('Profile', {uid: user.uid})}}/>
          }
          <Text style={[s.userName, {marginLeft: 8}]} onPress={()=>{navigation.navigate('Profile', {uid: user.uid})}}>{user.name}</Text>
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
            <MaterialCommunityIcons name='send' color={'#ffffff'} size={30} style={s.icon} onPress={()=> { handleShare(post.downloadURL) }}/>
          </View>
          <Text style={s.userName}>{user.name}</Text>
          <Text style={s.caption}>{post.caption}</Text>
          <Text style={s.viewComments} onPress={()=> navigation.navigate('Comment', {postId: post.id, uid: user.uid, caption: post.caption, username: user.name})}>View Comments...</Text>
        </View>
        {
          handleDate()
        }
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
  },
  date: {
    color: '#a19f9f',
    fontSize: 13,
    marginLeft: 10
  }
});