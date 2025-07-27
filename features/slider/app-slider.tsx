/**
 * @component Slider
 * @filepath /features/slider/app-slider.tsx
 */

'use client';

// Imports - scripts (node)
import { useCallback, useEffect, useRef, useState, Children } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import AutoScroll from 'embla-carousel-auto-scroll';

// Imports - scripts (local)
import { useSliderContext } from '@/features/slider/';

// Imports - components (local)
import { cn } from '@/lib/utils';

// Types
export type SliderAnimationType = 'default' | 'autoplay' | 'auto-scroll';

export type SliderProps = {
	animation?: SliderAnimationType;
	loop?: boolean;
	pauseOnHover?: boolean;
	className?: string;
	children: React.ReactNode;
};

// Component(s)
export const Slider = ({ animation = 'default', loop = false, pauseOnHover = false, className, children }: SliderProps) => {
	// Refs
	const viewportRef = useRef<HTMLDivElement>(null);

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
	const { isHovered, setIsHovered, animationPaused, setCurrentSlide } = useSliderContext();

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
			console.log('Toggle autoplay:', autoplay);
			// Toggle autoplay based on animationPaused state
			if (animationPaused || (pauseOnHover && isHovered)) {
				console.log('Stop autoplay');
				autoplay.stop();
			} else if (!animationPaused) {
				console.log('Start autoplay');
				autoplay.reset();
			}
		}

		// If animation type is 'auto-scroll'...
		const autoScroll = emblaApi?.plugins()?.autoScroll;
		if (autoScroll) {
			console.log('Toggle autoScroll:', animationPaused, autoScroll.isPlaying());
			// Toggle auto-scroll based on animationPaused state
			if (animationPaused || (pauseOnHover && isHovered)) {
				console.log('Stop auto-scroll');
				autoScroll.stop();
			} else if (!animationPaused) {
				console.log('Start auto-scroll');
				autoScroll.play();
			}
		}
	}, [animationPaused, isHovered, pauseOnHover, emblaApi]);

	// Render
	return (
		<div
			data-slot="slider"
			className={cn('overflow-hidden w-full', className)}
			ref={emblaRef}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div data-slot="slider-viewport" ref={viewportRef} className="flex" style={{ height: maxHeight || 'auto' }}>
				{Children.map(children, (child, index) => (
					<div data-slot="slider-slide" key={index} className="min-w-full shrink-0 grow-0">
						{child}
					</div>
				))}
			</div>
		</div>
	);
};
