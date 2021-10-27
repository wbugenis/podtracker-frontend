import { createSlice } from '@reduxjs/toolkit';

export const epSlice = createSlice({
    name: 'episodes',
    initialState: {
        epId: null,
        userEpisodes: []
    },
    reducers: {
        changeId: (state, action) => {
            return {
            ...state,
            epId: action.payload.id
            }
        },
        setUserEpisodes: (state, action) =>{
            return {
                ...state,
                userEpisodes: action.payload
            }
        },
        addUserEpisodes: (state, action) => {
            return {
                ...state,
                userEpisodes: [...state.userEpisodes, action.payload]
            }
        },
        updateUserEpisodes: (state, action) =>{
            return {
                ...state, 
                userEpisodes: state.userEpisodes.map(ep => {
                    if(ep.id === action.payload.id){
                        return action.payload
                    }
                    return ep
                })
            }
        }
    }
})

export const { changeId, setUserEpisodes, addUserEpisodes, updateUserEpisodes } = epSlice.actions;
export default epSlice.reducer;