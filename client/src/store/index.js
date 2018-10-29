import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'

// Declare the middleware methods
const middleware = [thunk]

// Create the store
const store = createStore(rootReducer, applyMiddleware(...middleware))

export default store
