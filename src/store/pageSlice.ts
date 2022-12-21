import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import LangPack from 'shared/types/lang';

interface InitialStateType {
	hostURL: string;
	chatServiceURI: string;
	mediaServiceURI: string;
	pageLang: typeof LangPack | null;
}

const initialState: InitialStateType = {
	hostURL: process.env.NEXT_PUBLIC_HOST as string,
	chatServiceURI: process.env.NEXT_PUBLIC_CHAT_SERVICE_URI as string,
	mediaServiceURI: process.env.NEXT_PUBLIC_MEDIA_SERVICE_URI as string,
	pageLang: null,
};

export const pageSlice = createSlice({
	name: 'page',
	initialState,
	reducers: {
		setLanguage: (state, value: PayloadAction<any>) => {
            state.pageLang = value.payload
		},
	},
});

export const { setLanguage } = pageSlice.actions;
export default pageSlice.reducer;

/*
import React from 'react'
import type { RootState } from '../../app/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}*/
