/**
 * @component SliderDots
 * @filepath /features/slider/components/slider-dots.tsx
 * @description: This component renders dot navigation for the slider.
 */

'use client';

// Imports - scripts (node)
import { useEffect, useState } from 'react';

// Imports - scripts (local)
import { cn } from '@/lib/utils';
import { useSliderContext } from '@/features/slider/';

// Imports - components (local)
import { Button } from '@/components/ui/button';

// Component(s)
export const SliderDots = () => {
	// Context
	const { emblaApi, setAnimationPaused, currentSlide } = useSliderContext();

	// State
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

	// Hooks
	useEffect(() => {
		// If no emblaApi is available, return early
		if (!emblaApi) return;

		// Set initial scroll snaps
		setScrollSnaps(emblaApi.scrollSnapList());

		// Update dots if the number of slides changes
		const onReInit = () => setScrollSnaps(emblaApi.scrollSnapList());

		// Add event listener - reInit
		emblaApi.on('reInit', onReInit);

		// Cleanup
		return () => {
			emblaApi.off('reInit', onReInit);
		};
	}, [emblaApi]);

	// Handlers
	const handleClick = (index: number) => {
		// If no emblaApi is available, return early
		if (!emblaApi) return;

		// Pause animation
		setAnimationPaused(true);

		// Scroll to the clicked index
		emblaApi.scrollTo(index);
	};

	// If no emblaApi is available, return null
	if (!emblaApi) return null;

	// Render default
	return (
		<div className="flex justify-center gap-2 mt-4">
			{scrollSnaps.map((_, index) => (
				<button
					key={index}
					className={cn(
						'h-3 w-3 rounded-full transition-colors duration-300',
						currentSlide === index ? 'bg-foreground' : 'cursor-pointer bg-muted-foreground hover:bg-muted-foreground/50',
					)}
					onClick={() => handleClick(index)}
					aria-label={`Go to slide ${index + 1}`}
				/>
			))}
		</div>
	);
};
