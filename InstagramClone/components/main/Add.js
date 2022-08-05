import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, Dimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const widthvw = Dimensions.get('window').width; //full width
const heightvh = Dimensions.get('window').height; //full height 

export default function Add({navigation}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);

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

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
      <View style={s.cameraContainer}>
        <Camera style={s.fixedRatio} type={type} ratio={'1:1'} ref={ref => setCamera(ref)} />
      </View>
      <Button
        title='Flip Image'
        onPress={()=>{
          setType(
            type === Camera.Constants.Type.back ?
            Camera.Constants.Type.front : 
            Camera.Constants.Type.back
          )
        }}
        />
        <Button title='Take Picture' onPress={takePicture} />
        <Button title='Select From Gallery' onPress={pickImage} />
        <Button title='Save' onPress={()=> navigation.navigate('Save', {image})}/>
        {
          image && <Image style={s.image} source={{uri: image}}/>
        }
    </View>
  );
}

const s = StyleSheet.create({
  cameraContainer: {
    width: widthvw,
    aspectRatio: 1
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  image: {
    flex: 1
  }
});