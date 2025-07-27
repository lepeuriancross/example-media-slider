/**
 * @component SliderPauseButton
 * @filepath /features/slider/components/slider-pause-button.tsx
 * @description: This component provides a button to pause or resume the slider animation.
 */

'use client';

// Imports - scripts (local)
import { cn } from '@/lib/utils';
import { useSliderContext } from '@/features/slider/';

// Imports - components (local)
import { Button } from '@/components/ui/button';

// Component(s)
export const SliderPauseButton = () => {
	// Context
	const { animationPaused, setAnimationPaused } = useSliderContext();

	// Render default
	return (
		<Button className={cn('slider-pause-button', { 'is-paused': animationPaused })} variant="outline" onClick={() => setAnimationPaused(!animationPaused)}>
			{animationPaused ? 'Resume' : 'Pause'}
		</Button>
	);
};
