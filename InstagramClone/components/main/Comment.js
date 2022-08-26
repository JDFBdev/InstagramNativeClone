import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, InteractionManager } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { fetchUsersData } from '../../redux/actions';
import  { connect, useSelector, useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Comment({route}) {
    const { postId, uid, caption, username, profilePicture } = route.params;
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const users = useSelector((state) => state.users);
    const dispatch = useDispatch();

    useEffect(()=>{
        getComments()
    },[postId, users]) // Al abrir un post y cuando carguen usuarios nuevos

    const getComments = function(){

        firebase.firestore()   // Lo fetcheamos
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
            let comments = snapshot.docs.map(doc => {  // Los mapeamos a data facil de consumir
                const data = doc.data();
                const id = doc.id;
                return {...data, id}  // En este caso, data contien 2 propiedades. El objecto que se devuelve tendra las 3
            })
            matchUserToComment(comments);   // Llamamos a la funcion que les agrega el nombre de usuario a los comentarios
            
        })
    }

    function matchUserToComment(comments){
        for(let i = 0; i < comments.length; i++){
            
            if(comments[i].hasOwnProperty('user')){
                continue;
            }

            const user = users.find(x => x.uid === comments[i].creator); // buscamos el usuario que hizo el comentario en users, mediante uid
            if(user == undefined){  // Si no lo tengo
                dispatch(fetchUsersData(comments[i].creator, false)) // Lo busco. Segundo parametro es getPosts
            } else {
                comments[i].user = user;
            }
        }

        setComments(comments);
        
    }
    

    const onComment = function(){
        firebase.firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .add({creator: firebase.auth().currentUser.uid, text: text, creation: firebase.firestore.FieldValue.serverTimestamp()})
        setText('')
        getComments();
    }

  return (
    <View style={s.container}>
        <View style={[s.commentContainer, {borderWidth: 1, borderBottomColor: '#303030',}]}>
            {
                profilePicture ? 
                <Image style={s.profilePicture} source={{uri: profilePicture}} onPress={()=>{navigation.navigate('Profile', {uid: uid})}}/> :
                <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={38} onPress={()=>{navigation.navigate('Profile', {uid: uid})}}/>
            }
            <View style={s.data}>
                <Text style={s.commentUserName}>{username}</Text>
                <Text style={s.comment}>{caption}</Text>
            </View>
        </View>
        <FlatList
            numColumns={1}
            horizonta={false}
            data={comments}
            renderItem={({item})=>(
                <View style={s.commentContainer}>
                        {
                            item.user !== undefined ? 
                            (item.user.profilePicture ? 
                                <Image style={s.profilePicture} source={{uri: item.user.profilePicture}} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}/> :
                                <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={38} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}/>
                            ):
                            <MaterialCommunityIcons name='account-circle' color={'#ffffff'} size={38} onPress={()=>{navigation.navigate('Profile', {uid: item.user.uid})}}/>
                        }
                    <View style={s.data}>
                        {
                            item.user !== undefined ?
                            <Text style={s.commentUserName}>{item.user.name}</Text> :
                            null
                        }
                        <Text style={s.comment}>{item.text}</Text>
                    </View>
                </View>
            )}
        />
        <View>
            <TextInput 
                multiline
                numberOfLines={2}
                placeholderTextColor='white'
                style={s.textInput}
                placeholder='Comment...'
                value={text}
                onChangeText={(text) => { setText(text) }}
            />
            <TouchableOpacity onPress={onComment}>
              <View style={s.saveBtn}>
                <Text style={{color: 'white', fontSize: 18, fontWeight: '500'}}>Send Comment</Text>
              </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default connect(null, { fetchUsersData })(Comment);

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20
    },
    commentContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    data:{
        marginLeft: 10,
        
    },
    commentUserName:{
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    },
    comment: {
        color: '#ffffff',
        fontSize: 16
    }, 
    saveBtn: {
        backgroundColor: '#366efc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
        marginBottom: 10
    }, 
    textInput: {
        color: 'white',
        borderRadius: 15,
        padding: 5,
        marginBottom: 20
    },
    profilePicture: {
        width: 38,
        height: 38,
        borderRadius: 19
    }
})