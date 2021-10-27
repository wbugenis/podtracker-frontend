import { configureStore } from '@reduxjs/toolkit';
import episodeReducer from './epSlice'

export default configureStore({
    reducer: {
        episodes: episodeReducer
    }
})
