import * as constants from "../constants"

const initialState = {
    currentUser: null,
    posts: [],
    following: [],
    users: [],
    usersLoaded: 0,
    feed: []
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
            usersLoaded: state.usersLoaded + 1,
            users: state.users.map(user => 
                user.uid === action.payload.uid ? 
                {...user, posts: action.payload.posts}:
                user
            )
        }

    default:
        return state
        
  }
}
