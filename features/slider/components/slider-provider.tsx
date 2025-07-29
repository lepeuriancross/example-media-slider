/**
 * @component SliderProvider
 * @filepath /features/slider/components/slider-provider.tsx
 * @description: This component provides the context for the Slider component, allowing it to manage its state and behavior.
 */

'use client';

// Imports - types / config
import type { EmblaCarouselType } from 'embla-carousel';
import type { RootState } from '@/redux/store';

// Imports - scripts (node)
import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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
	mediaIds: string[];
	isPlayingMedia: boolean;
};

export type MediaSliderContextType = {
	mediaIds: string[];
	addMediaId: (id: string) => void;
	removeMediaId: (id: string) => void;
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

const MediaSliderContext = createContext<MediaSliderContextType | undefined>(undefined);

export const useMediaSliderContext = (): MediaSliderContextType | undefined => {
	const context = useContext(MediaSliderContext);

	if (!context) return undefined;

	return context;
};

// Component(s)
export const SliderProvider = ({ children }: { children: React.ReactNode }) => {
	// Store
	const currentlyPlaying = useSelector((state: RootState) => state.media.currentlyPlaying);

	// State
	const [animationPaused, setAnimationPaused] = useState(false);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
	const [isHovered, setIsHovered] = useState(false);

	const [isPlayingMedia, setIsPlayingMedia] = useState(false);
	const [mediaIds, setMediaIds] = useState<string[]>([]);

	// Functions
	const addMediaId = (id: string) => {
		if (!mediaIds.includes(id)) {
			setMediaIds((prev) => [...prev, id]);
		}
	};

	const removeMediaId = (id: string) => {
		setMediaIds((prev) => prev.filter((mediaId) => mediaId !== id));
	};

	// Hooks
	useEffect(() => {
		// If currentlyPlaying video is in the mediaIds, reset the state
		setIsPlayingMedia(typeof currentlyPlaying === 'string' && mediaIds.includes(currentlyPlaying));
	}, [currentlyPlaying, mediaIds]);

	// Init
	const sliderValue: SliderContextType = {
		animationPaused,
		setAnimationPaused,
		currentSlide,
		setCurrentSlide,
		emblaApi,
		setEmblaApi,
		isHovered,
		setIsHovered,
		mediaIds,
		isPlayingMedia,
	};

	const sliderMediaValue: MediaSliderContextType = {
		mediaIds,
		addMediaId,
		removeMediaId,
	};

	// Render default
	return (
		<SliderContext.Provider value={sliderValue}>
			<MediaSliderContext.Provider value={sliderMediaValue}>{children}</MediaSliderContext.Provider>
		</SliderContext.Provider>
	);
};
