import React, {useState} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Post({route}) {
  
  const post = route.params.post;
  console.log(post)

  return (
    <View style={s.container}>
      <View style={s.postContainer}>
        {/* <View style={s.postHeader}>
          {
            item.user.profilePicture !== undefined ? 
            <Image style={s.profilePicture} source={{uri: item.user.profilePicture}} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}/> :
            <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={32} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}} />
          }
          <Text style={[s.userName, {marginLeft: 8}]} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}>{item.user.name}</Text>
        </View> */}
        <Image style={s.image} source={{uri: post.downloadURL}} />
        <View style={s.postBottom}>
          {/* <View style={s.icons}>
            {
              item.currentUserLike ?
              <TouchableOpacity onPress={() => onDislikePress(item.user.uid, item.id)}>
                <MaterialCommunityIcons name='cards-heart' color={'#ED4956'} size={32}/>
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => onLikePress(item.user.uid, item.id)}>
                <MaterialCommunityIcons name='cards-heart-outline' color={'#ffffff'} size={30}/>
              </TouchableOpacity>
            }
            <MaterialCommunityIcons name='chat-outline' color={'#ffffff'} size={30} style={s.icon} onPress={()=> navigation.navigate('Comment', {postId: item.id, uid: item.user.uid, caption: item.caption, username: item.user.name})}/>
            <MaterialCommunityIcons name='send' color={'#ffffff'} size={30} style={s.icon} onPress={()=> { handleShare(item.downloadURL) }}/>
          </View> */}
          {/* <Text style={s.userName}>{item.user.name}</Text> */}
          <Text style={s.caption}>{post.caption}</Text>
          {/* <Text style={s.viewComments} onPress={()=> navigation.navigate('Comment', {postId: item.id, uid: item.user.uid, caption: item.caption, username: item.user.name})}>View Comments...</Text> */}
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