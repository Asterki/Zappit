import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../shared/types/models';

interface InitialState {
	sessionID: null | string;
	user: null | User;
}

const initialState: InitialState = {
	sessionID: null,
	user: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setSessionID: (state, value: PayloadAction<string | null>) => {
			state.sessionID = value.payload;
		},
		setUser: (state, value: PayloadAction<User | null>) => {
			state.user = value.payload;
		},
	},
});

export default userSlice.reducer;
export const { setSessionID, setUser } = userSlice.actions;
