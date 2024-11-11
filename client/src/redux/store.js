import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import messageReducer from './messageSlice.js';
import socketReducer from './socketSlice.js';
import storageSession from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';
import {
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';

const persistConfig = {
	key: 'root',
	version: 1,
	storage: storageSession,
	whitelist: ['user'],
	blacklist: ['messages', 'socket'], // Exclude 'socket' from being persisted
};

const rootReducer = combineReducers({
	user: userReducer,
	message: messageReducer,
	socket: socketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'socket/setSocket'],
				ignoredPaths: ['socket'], // Ignore the 'socket' path to allow non-serializable data
			},
		}),
});

export default store;
