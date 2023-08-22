import { configureStore } from '@reduxjs/toolkit'
import { popupSlice } from './slices/popupSlice'

export const store = configureStore({
    reducer: {
        [popupSlice.name]: popupSlice.reducer
    },
    devTools: true
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
