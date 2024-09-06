import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from './Slices/userSlice';
import adminReducer from './Slices/adminSlice';
import therapistReducer from './Slices/therapistSlice';

//persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'admin', 'therapist']
}

//rootreducer for wrapping it with persistReducer
const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer,
    therapist: therapistReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

//configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
})

//persistor for the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;