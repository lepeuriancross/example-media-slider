/**
 * @component SliderNextButton
 * @filepath /features/slider/components/slider-next-button.tsx
 * @description: This component renders a button to navigate to the previous slide in the slider.
 */

'use client';

// Imports - scripts (local)
import { useSliderContext } from '@/features/slider';

// Imports - components (node)
import { ArrowRightIcon } from 'lucide-react';

// Imports - components (local)
import { Button } from '@/components/ui/button';

// Component(s)
export const SliderNextButton = ({ className }: { className?: string }) => {
	// Context
	const { setAnimationPaused, emblaApi } = useSliderContext();

	// Handlers
	const handleClick = () => {
		if (emblaApi) {
			setAnimationPaused(true);
			emblaApi.scrollNext();
		}
	};

	// Render default
	return (
		<Button className={className} variant="outline" size="icon" disabled={!emblaApi} onClick={handleClick}>
			<ArrowRightIcon />
		</Button>
	);
};
