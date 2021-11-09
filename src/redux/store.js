import { configureStore } from '@reduxjs/toolkit';
import episodeReducer from './epSlice';
import podReducer from './podSlice';

export default configureStore({
    reducer: {
        episodes: episodeReducer,
        podcast: podReducer
    }
})
