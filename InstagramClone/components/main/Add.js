import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { clearData, fetchUser, fetchUserFollowing, fetchUserPosts } from '../../redux/actions/index';
import  { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

const widthvw = Dimensions.get('window').width; //full width
const heightvh = Dimensions.get('window').height; //full height

function Add({navigation, route}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const takePicture = async function(){
    if(camera){
      const data = await camera.takePictureAsync(null);
      setImage(data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async function(){
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
    const response = await fetch(image);
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
        if(route.params !== undefined){
          updateProfilePicutre(snapshot);
        } else {
          setPostData(snapshot);
        }
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
      .add({downloadURL: downloadURL, caption , creation: firebase.firestore.FieldValue.serverTimestamp()})
      .then((function(){
        dispatch(clearData());
        dispatch(fetchUser());
        dispatch(fetchUserPosts());
        dispatch(fetchUserFollowing());
        navigation.navigate('Main')
      }))
  }

  const updateProfilePicutre = function(downloadURL){
    firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .set({ profilePicture: downloadURL }, {merge: true})
    .then((function(){
      dispatch(clearData());
      dispatch(fetchUser());
      dispatch(fetchUserPosts());
      dispatch(fetchUserFollowing());
      navigation.navigate('Profile', {uid: firebase.auth().currentUser.uid})
    }))
  }

  if (hasCameraPermission === null) {
    return <View />;
  }
  
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#000000'}}>
      {
        image ? 
        <View style={s.saveContainer}>
          <View style={[s.cameraContainer, {marginTop: 20, marginBottom: 10}]}>
            <Image source={{ uri: image}} style={s.image}/>
          </View>
          <View style={{padding: 10}}>
            {
              route.params === undefined && 
              <TextInput
              multiline
              numberOfLines={2}
              placeholderTextColor='white'
              style={s.textInput}
              placeholder='Caption...'
              onChangeText={(caption) => setCaption(caption)}
              />
            }
            <TouchableOpacity onPress={() => uploadImage()}>
              <View style={s.saveBtn}>
                {
                  route.params !== undefined ? 
                  <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>Update Profile Picture</Text> :
                  <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>Post</Text>
                }
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setImage(null)}>
              <View style={s.cancelBtn}>
                <Text style={{color: 'white', fontSize: 19}}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View> : 
        <>
        <View style={s.cameraContainer}>
          <Camera style={s.camera} type={type} ratio={'1:1'} ref={ref => setCamera(ref)} /> 
        </View>
        <View style={s.icons}>
          <TouchableOpacity onPress={()=>{ setType( type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}}>
            <View style={s.iconContainer} >
              <MaterialCommunityIcons name='camera-flip' color={'white'} size={30} onPress={()=>{ setType( type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture}>
            <View style={s.cameraIconContainer}>
              <MaterialCommunityIcons name='camera' color={'white'} size={45} onPress={takePicture}/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture}>
            <View style={s.iconContainer} >
              <MaterialCommunityIcons name='image' color={'white'} size={30} onPress={pickImage}/>
            </View>
          </TouchableOpacity>
        </View>
      </>
      }

      
    </View>
  );
}

export default connect(null, { fetchUser, fetchUserPosts, fetchUserFollowing, clearData })(Add);

const s = StyleSheet.create({
  cameraContainer: {
    width: widthvw,
    aspectRatio: 1,
    marginTop: heightvh / 8
  },
  camera: {
    flex: 1,
    aspectRatio: 1
  },
  image: {
    flex: 1
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 30
  },
  iconContainer: {
    padding: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.60)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'black',
  },
  cameraIconContainer: {
    padding: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.60)',
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  textInput: {
    color: 'white',
    backgroundColor: '#3D3D3D',
    borderRadius: 15,
    padding: 5,
    marginBottom: 20
  },
  saveBtn: {
    backgroundColor: '#366efc',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40,
    marginBottom: 10
  },
  cancelBtn: {
    backgroundColor: '#3D3D3D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 40
  }

});