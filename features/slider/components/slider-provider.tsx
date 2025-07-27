/**
 * @component SliderProvider
 * @filepath /features/slider/components/slider-provider.tsx
 * @description: This component provides the context for the Slider component, allowing it to manage its state and behavior.
 */

'use client';

// Imports - types / config
import type { EmblaCarouselType } from 'embla-carousel';

// Imports - scripts (node)
import { createContext, useContext, useState, useEffect } from 'react';

// Types
export type SliderContextType = {
	animationPaused: boolean;
	setAnimationPaused: (paused: boolean) => void;
	currentSlide: number;
	setCurrentSlide: (index: number) => void;
	emblaApi?: EmblaCarouselType | null;
	setEmblaApi: (api: EmblaCarouselType | null) => void;
	isHovered: boolean;
	setIsHovered: (hovered: boolean) => void;
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
	const [animationPaused, setAnimationPaused] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
	const [isHovered, setIsHovered] = useState(false);

	// Hooks
	useEffect(() => {
		console.log('Current slide changed:', currentSlide);
	}, [currentSlide]);

	// Init
	const value: SliderContextType = {
		animationPaused,
		setAnimationPaused,
		currentSlide,
		setCurrentSlide,
		emblaApi,
		setEmblaApi,
		isHovered,
		setIsHovered,
	};

	// Render default
	return <SliderContext.Provider value={value}>{children}</SliderContext.Provider>;
};
