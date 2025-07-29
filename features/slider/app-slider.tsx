/**
 * @component Slider
 * @filepath /features/slider/app-slider.tsx
 */

'use client';

// Imports - types / config
import type { RootState } from '@/redux/store';

// Imports - scripts (node)
import { useCallback, useEffect, useRef, useState, Children } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import AutoScroll from 'embla-carousel-auto-scroll';

// Imports - scripts (local)
import { setCurrentlyPlaying } from '@/features/media/store/media-slice';
import { useSliderContext } from '@/features/slider/';

// Imports - components (local)
import { cn } from '@/lib/utils';

// Types
export type SliderAnimationType = 'default' | 'autoplay' | 'auto-scroll';

export type SliderProps = {
	animation?: SliderAnimationType;
	loop?: boolean;
	pauseOnDrag?: boolean;
	pauseOnHover?: boolean;
	pauseOnPlayingMedia?: boolean;
	className?: string;
	children: React.ReactNode;
};

// Component(s)
export const Slider = ({
	animation = 'default',
	loop = false,
	pauseOnDrag = false,
	pauseOnHover = false,
	pauseOnPlayingMedia = true,
	className,
	children,
}: SliderProps) => {
	// Refs
	const viewportRef = useRef<HTMLDivElement>(null);

	// Store
	const dispatch = useDispatch();
	const currentlyPlaying = useSelector((state: RootState) => state.media.currentlyPlaying);

	// State
	const [maxHeight, setMaxHeight] = useState<number>(0);

	// Plugins
	const plugins = (() => {
		if (animation === 'autoplay') {
			const instance = Autoplay({ delay: 3000, stopOnInteraction: false });
			return [instance];
		}
		if (animation === 'auto-scroll') {
			const instance = AutoScroll({ speed: 1, stopOnInteraction: false });
			return [instance];
		}
		return [];
	})();

	// Embla setup
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop }, plugins);

	// Context
	const { animationPaused, setAnimationPaused, setCurrentSlide, setEmblaApi, isHovered, setIsHovered, isPlayingMedia, mediaIds } = useSliderContext();

	// Functions
	const updateHeight = useCallback(() => {
		if (!viewportRef.current) return;

		const slideEls = viewportRef.current.querySelectorAll('[data-slot="slider-slide"]');
		const heights = Array.from(slideEls).map((el) => (el as HTMLElement).offsetHeight);
		const tallest = Math.max(...heights, 0);
		setMaxHeight(tallest);
	}, []);

	const updateSelected = useCallback(() => {
		if (!emblaApi) return;
		setCurrentSlide(emblaApi.selectedScrollSnap());
	}, [emblaApi, setCurrentSlide]);

	// Hooks
	useEffect(() => {
		// If emblaApi is not set, do not proceed
		if (!emblaApi) return;

		// Set emblaApi in context
		setEmblaApi(emblaApi);
	}, [emblaApi, setEmblaApi]);

	useEffect(() => {
		// If no emblaApi is available, do not proceed
		if (!emblaApi) return;

		// Add event listener - on select
		emblaApi.on('select', () => {
			updateHeight();
			updateSelected();
		});

		// Init
		updateHeight();
		updateSelected();
	}, [emblaApi, updateHeight, updateSelected]);

	useEffect(() => {
		// Add event listener - on window resize
		window.addEventListener('resize', updateHeight);

		// Cleanup
		return () => window.removeEventListener('resize', updateHeight);
	}, [updateHeight]);

	useEffect(() => {
		// If emblaApi has not initialized, return early
		if (!emblaApi) return;

		// If animation type is 'autoplay'...
		const autoplay = emblaApi?.plugins()?.autoplay;
		if (autoplay) {
			// Toggle autoplay based on animationPaused state
			if (animationPaused || (pauseOnHover && isHovered) || (pauseOnPlayingMedia && isPlayingMedia)) {
				autoplay.stop();
			} else if (!animationPaused && (!pauseOnHover || !isHovered) && (!pauseOnPlayingMedia || !isPlayingMedia)) {
				autoplay.play();
			}
		}

		// If animation type is 'auto-scroll'...
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (autoScroll) {
			// Toggle auto-scroll based on animationPaused state
			if (animationPaused || (pauseOnHover && isHovered) || (pauseOnPlayingMedia && isPlayingMedia)) {
				autoScroll.stop();
			} else if (!animationPaused && (!pauseOnHover || !isHovered) && (!pauseOnPlayingMedia || !isPlayingMedia)) {
				autoScroll.play();
			}
		}
	}, [animationPaused, isHovered, pauseOnHover, emblaApi, isPlayingMedia, pauseOnPlayingMedia]);

	useEffect(() => {
		if (!emblaApi || !pauseOnDrag) return;

		// Functions
		const handleSelect = () => {
			// If currentlyPlaying video in the mediaIds, reset the state
			if (currentlyPlaying && mediaIds.includes(currentlyPlaying)) {
				dispatch(setCurrentlyPlaying(null));
			}
		};

		const handlePointerDown = () => {
			// Pause animation when dragging starts
			setAnimationPaused(true);
		};

		// Add event listeners
		emblaApi.on('select', handleSelect);
		emblaApi.on('pointerDown', handlePointerDown);

		// Cleanup
		return () => {
			emblaApi.off('select', handleSelect);
			emblaApi.off('pointerDown', handlePointerDown);
		};
	}, [currentlyPlaying, dispatch, emblaApi, mediaIds, pauseOnDrag, setAnimationPaused]);

	// Render
	return (
		<div data-slot="slider" className={cn('overflow-hidden w-full', className)} ref={emblaRef}>
			<div
				data-slot="slider-viewport"
				ref={viewportRef}
				className="flex"
				style={{ height: maxHeight || 'auto' }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{Children.map(children, (child, index) => (
					<div data-slot="slider-slide" key={index} className="min-w-full max-w-dvw shrink-0 grow-0">
						{child}
					</div>
				))}
			</div>
		</div>
	);
};
