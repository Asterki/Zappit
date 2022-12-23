/* eslint-disable @typescript-eslint/no-var-requires */
import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import LangPack from 'shared/types/lang';

const languages = {
	en: require('../../shared/locales/en').default as typeof LangPack,
	es: require('../../shared/locales/es').default as typeof LangPack,
    initial: require("../../shared/locales/placeholder").default as typeof LangPack
};

interface InitialStateType {
	hostURL: string;
	chatServiceURI: string;
	mediaServiceURI: string;
	pageLang: typeof LangPack;
}

const initialState: InitialStateType = {
	hostURL: process.env.NEXT_PUBLIC_HOST as string,
	chatServiceURI: process.env.NEXT_PUBLIC_CHAT_SERVICE_URI as string,
	mediaServiceURI: process.env.NEXT_PUBLIC_MEDIA_SERVICE_URI as string,
	pageLang: languages['initial'], // TODO: I should add a skeleton language
};

export const pageSlice = createSlice({
	name: 'page',
	initialState,
	reducers: {
		setLanguage: (state, value: PayloadAction<typeof LangPack>) => {
			state.pageLang = value.payload;
		},
	},
});

export default pageSlice.reducer;
export const { setLanguage } = pageSlice.actions;