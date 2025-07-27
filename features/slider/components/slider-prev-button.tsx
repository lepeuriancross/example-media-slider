/**
 * @component SliderPrevButton
 * @filepath /features/slider/components/slider-prev-button.tsx
 * @description: This component renders a button to navigate to the previous slide in the slider.
 */

'use client';

// Imports - scripts (local)
import { useSliderContext } from '@/features/slider';

// Imports - components (node)
import { ArrowLeftIcon } from 'lucide-react';

// Imports - components (local)
import { Button } from '@/components/ui/button';

// Component(s)
export const SliderPrevButton = ({ className }: { className?: string }) => {
	// Context
	const { setAnimationPaused, emblaApi } = useSliderContext();

	// Handlers
	const handleClick = () => {
		if (emblaApi) {
			setAnimationPaused(true);
			emblaApi.scrollPrev();
		}
	};

	// Render default
	return (
		<Button className={className} variant="outline" size="icon" disabled={!emblaApi} onClick={handleClick}>
			<ArrowLeftIcon />
		</Button>
	);
};
