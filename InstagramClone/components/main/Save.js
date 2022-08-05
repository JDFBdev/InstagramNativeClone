import React, { useState } from 'react';
import { View, TextInput, Image, Button } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export default function Save(props, {navigation}){
  const [caption, setCaption] = useState("");

  const uploadIamge = async function(){
    const uri = props.route.params.image;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    const response = await fetch(uri);
    const blob = await response.blob()

    const task = firebase
      .storage()
      .ref()
      .child(childPath)
      .put(blob)

    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot)=>{
        setPostData(snapshot);
        console.log(snapshot);
      })
    }

    const taskError = snapshot => {
      console.log(snapshot);
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);

  }

  const setPostData = function(downloadURL){
    firebase.firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({downloadURL: downloadURL, caption: caption, creation: firebase.firestore.FieldValue.serverTimestamp()})
      .then((function(){
        navigation.popToTop()
      }))
  }

  return (
    <View style={{flex: 1}}>
      <Image source={{uri: props.route.params.image}}/>
      <TextInput
        placeholder='Caption...'
        onChange={(caption) => setCaption(caption)}
      />
      <Button title='Save' onPress={() => uploadIamge()} />
    </View>
  )
}
