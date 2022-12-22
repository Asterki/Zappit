import { configureStore } from '@reduxjs/toolkit';

import pageReducer from './pageSlice';
import userReducer from './userSlice';

export const store = configureStore({
	reducer: {
		page: pageReducer,
        user: userReducer
	},
    devTools: true
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
