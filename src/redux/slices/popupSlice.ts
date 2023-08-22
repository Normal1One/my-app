import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '../store'

export interface PopupState {
    open: boolean
    postId: string
}

const initialState: PopupState = {
    open: false,
    postId: ''
}

export const popupSlice = createSlice({
    name: 'popup',
    initialState,
    reducers: {
        setOpen(state, action) {
            state.open = action.payload
        },
        setPostId(state, action) {
            state.postId = action.payload
        }
    }
})

export const { setOpen, setPostId } = popupSlice.actions

export const selectPopupState = (state: AppState) => state.popup

export default popupSlice.reducer
