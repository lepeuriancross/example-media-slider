/**
 * @name: Media Slice
 * @filepath /features/media/store/media-slice.ts
 */

// Imports - scripts (node)
import { createSlice } from '@reduxjs/toolkit';

// Types
interface MediaState {
	currentlyPlaying?: string | null;
}

// Settings
const initialState: MediaState = {
	currentlyPlaying: null,
};

// Slice
const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setCurrentlyPlaying: (state, action: { payload: string | null }) => {
			state.currentlyPlaying = action.payload;
		},
	},
});

export const { setCurrentlyPlaying } = mediaSlice.actions;
export default mediaSlice.reducer;
