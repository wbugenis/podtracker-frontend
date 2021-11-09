import { createSlice } from '@reduxjs/toolkit';

//Holds info and array of episode components
//For display on MyPodcast page
export const podSlice = createSlice({
    name: 'podcast',
    initialState: {
        display: "none",
        info: {
            id: null,
            podcast_img_url: "",
            title: "",
            description: "",
        },
        episodeList: [],
    },
    reducers: {
        setDisplay: (state, action ) => {
            return {
                ...state,
                display: action.payload
            }
        },
        setInfo: (state, action) => {
            return {
                ...state,
                info: {...action.payload}
            }
        },
        setEpisodeList: (state, action) => {
            return {
                ...state,
                episodeList: [...action.payload]
            }
        }
    }
})

export const { setDisplay, setInfo, setEpisodeList} = podSlice.actions;
export default podSlice.reducer;