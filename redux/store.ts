/**
 * @name: Redux Store Configuration
 * @filepath /dash/redux/store.ts
 * @description Redux store configuration for the application.
 */

// Imports - scripts (node)
import { configureStore } from '@reduxjs/toolkit';

// Imports - scripts (local)
import mediaReducer from '@/features/media/store/media-slice';

// Store
export const store = configureStore({
	reducer: {
		media: mediaReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
