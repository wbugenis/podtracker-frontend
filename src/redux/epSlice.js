import { createSlice } from '@reduxjs/toolkit';

export const epSlice = createSlice({
    name: 'episodes',
    initialState: {
        userEpisodes: []
    },
    reducers: {
        setUserEpisodes: (state, action) =>{
            return {
                ...state,
                userEpisodes: [...action.payload]
            }
        },
        
        updateUserEpisodes: (state, action) =>{
            console.log(action.payload);
            let newUserEpisodes = [...state.userEpisodes.filter(ep => ep.title !== action.payload.title)];
            newUserEpisodes.push(action.payload);
            return {
                ...state, 
                userEpisodes: newUserEpisodes
                // userEpisodes: [...state.userEpisodes.map(ep => {
                //     if(ep.id === action.payload.id){
                //         return action.payload
                //     }
                //     return ep
                // })]
            }
        }
    }
})

export const { setUserEpisodes, updateUserEpisodes } = epSlice.actions;
export default epSlice.reducer;