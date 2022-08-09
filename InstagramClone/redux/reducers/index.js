import * as constants from "../constants"

const initialState = {
    currentUser: null,  // Datos del usuario logueado
    posts: [],  // Posts de current user
    following: [],  // uid de usuarios que sigue
    users: [],  // Posts y datos de usuarios que sigue
    usersFollowingLoaded: 0  // Cuantos usuarios que sigue estan cargados en users
}

export default function rootReducer(state = initialState, action){

  switch (action.type) {
    case constants.USER_STATE_CHANGE:
        return { 
            ...state,
            currentUser: action.payload
        }

    case constants.USER_POSTS_STATE_CHANGE:
        return { 
            ...state,
            posts: action.payload
        }

    case constants.USER_FOLLOWING_STATE_CHANGE:
        return { 
            ...state,
            following: action.payload
        }

    case constants.USERS_DATA_STATE_CHANGE:
        return { 
            ...state,
            users: [...state.users, action.payload]
        }

    case constants.USERS_POSTS_STATE_CHANGE:
        return { 
            ...state,
            usersFollowingLoaded: state.usersFollowingLoaded + 1,
            users: state.users.map(user => 
                user.uid === action.payload.uid ? 
                {...user, posts: action.payload.posts}:
                user
            )
        }

    case constants.CLEAR_DATA:
        return { 
            currentUser: null,
            posts: [],
            following: [],
            users: [],
            usersFollowingLoaded: 0
        }

    default:
        return state
        
  }
}
