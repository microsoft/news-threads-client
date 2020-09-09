/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
import { Account } from 'msal'

interface AuthState {
	account: Account | null
	jwtIdToken: string | null
}

const initialState: AuthState = {
	account: null,
	jwtIdToken: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: {
		AAD_LOGIN_SUCCESS: (state, action) => ({
			...state,
			...action.payload,
		}),
	},
})

export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer
