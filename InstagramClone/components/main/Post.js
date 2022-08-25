import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import { deletePost, fetchUsersFollowingLikes } from '../../redux/actions/index';
import  { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

const widthvw = Dimensions.get('window').width; //full width
const heightvw = Dimensions.get('window').height; //full width

function Post({route, postFeed, userFeed}) {
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(()=>{
    let isMounted = true;

    if(route === undefined){
      setPost(postFeed);
      setUser(userFeed);
    } else {
      setPost(route.params.post);
      setUser(route.params.user);
    }

    if(!post.hasOwnProperty('currentUserLike')){
      firebase.firestore()
      .collection("posts")
      .doc(route === undefined ? userFeed.uid : route.params.user.uid)
      .collection("userPosts")
      .doc(route === undefined ? postFeed.id : route.params.post.id)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
  
        if(snapshot.exists){
          if(isMounted){
            setPost((prev)=>({...prev, currentUserLike: true}));
          }
        } else {
          if(isMounted){
            setPost((prev)=>({...prev, currentUserLike: false}));
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

    setPost((prev)=>({...prev, currentUserLike: true}));

    dispatch(fetchUsersFollowingLikes(user.uid, post.id));
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

    setPost((prev)=>({...prev, currentUserLike: false}));

    dispatch(fetchUsersFollowingLikes(user.uid, post.id));
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
    
    if(horas <= 23) return <Text style={s.date}>{horas} hours ago</Text>

    if(horas >= 24 && horas <= 167) return <Text style={s.date}>{dias} days ago</Text>

    if(horas > 167 && semanas === 1) return <Text style={s.date}>{semanas} week ago</Text>

    if(horas > 167) return <Text style={s.date}>{semanas} weeks ago</Text>

  }

  const handleDelete = function(){
    dispatch(deletePost(post.id));
    navigation.navigate('Feed')
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
          {
            user.uid === firebase.auth().currentUser.uid &&
            <MaterialCommunityIcons name='dots-vertical' color={'#ffffff'} size={30} style={s.dots} onPress={()=> setModalVisible(true)}/>
          }
        </View>
        <Image style={s.image} source={{uri: post.downloadURL}} />
        <View style={s.postBottom}>
          <View style={s.icons}>
            {
              post.currentUserLike ?
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
      {
        modalVisible && 
        <View style={s.modalFrameOpacity} />
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
          <TouchableOpacity style={s.modalFrame} onPress={()=> {setModalVisible(false);}} activeOpacity={1}>
            <TouchableOpacity style={s.modal} activeOpacity={1}>
              <View style={s.modalView}>
                <Text style={s.modalText}>Options</Text>
              </View>
              <TouchableOpacity onPress={()=> { handleDelete() }}>
                <View style={s.modalView} >
                  <Text style={s.modalText} onPress={()=> { handleDelete() }}>Delete Post</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
          
      </Modal>
    </View>
  )
}

export default connect(null, { fetchUsersFollowingLikes, deletePost })(Post);

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
  dots: {
    marginLeft: 'auto',
    marginRight: 12
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
  },
  modalFrameOpacity: {
    position: 'absolute',
    width: "100%",
    height: '100%',
    display: 'flex',
    backgroundColor: '#00000060'
  },
  modalFrame: {
    width: "100%",
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
},
  modal: {
      width: widthvw,
      height: 200,
      backgroundColor: '#212121',
      marginTop: heightvw - 200,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
  },
  modalView: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#383838'
  },
  modalText: {
    color: 'white',
    fontSize: 14
  }
});