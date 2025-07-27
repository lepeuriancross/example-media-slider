/**
 * @component SliderProvider
 * @filepath /features/slider/components/slider-provider.tsx
 * @description: This component provides the context for the Slider component, allowing it to manage its state and behavior.
 */

'use client';

// IMports - scripts (node)
import { createContext, useContext, useState, useEffect } from 'react';

// Types
export type SliderContextType = {
	currentSlide: number;
	setCurrentSlide: (index: number) => void;
	animationPaused: boolean;
	setAnimationPaused: (paused: boolean) => void;
};

// Context
const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSliderContext = (): SliderContextType => {
	const context = useContext(SliderContext);
	if (!context) {
		throw new Error('useSliderContext must be used within a SliderProvider');
	}
	return context;
};

// Component(s)
export const SliderProvider = ({ children }: { children: React.ReactNode }) => {
	// State
	const [currentSlide, setCurrentSlide] = useState(0);
	const [animationPaused, setAnimationPaused] = useState(false);

	// Hooks
	useEffect(() => {
		console.log('Current slide changed:', currentSlide);
	}, [currentSlide]);

	// Init
	const value = {
		currentSlide,
		setCurrentSlide,
		animationPaused,
		setAnimationPaused,
	};

	// Render default
	return <SliderContext.Provider value={value}>{children}</SliderContext.Provider>;
};
