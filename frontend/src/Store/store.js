import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slices/userSlice';
import adminReducer from './Slices/adminSlice';

//persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'admin']
}

//rootreducer for wrapping it with persistReducer
const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

//configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
})

//persistor for the store
export const persistor = persistStore(store);