/**
 * @name: Slider
 * @filepath /features/slider/index.ts
 * @description: This file exports the Slider components and their provider for use in the application.
 */

// Barrel
export { type SliderAnimationType, type SliderProps, Slider } from '@/features/slider/app-slider';

export { SliderDots } from '@/features/slider/components/slider-dots';
export { SliderPauseButton } from '@/features/slider/components/slider-pause-button';
export { SliderPrevButton } from '@/features/slider/components/slider-prev-button';
export { type SliderContextType, useSliderContext, SliderProvider } from '@/features/slider/components/slider-provider';
export { SliderNextButton } from '@/features/slider/components/slider-next-button';
