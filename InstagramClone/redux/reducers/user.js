const initialState = {
    currentUser: null
}

export default (state = initialState, action) => {
  switch (action.type) {

    case typeName:
        return { 
            ...state,
            currentUser: action.payload 
        }

    default:
        return state
        
  }
}
