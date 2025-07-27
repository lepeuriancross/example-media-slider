/**
 * @component Hero8
 * @filepath /containers/section/components/hero8.tsx
 * @description This component renders a hero section with a title, description, and call-to-action
 */

// Imports - components (node)
import { ChevronRight } from 'lucide-react';

// Imports - components (local)
import { Button } from '@/components/ui/button';

import { SectionWrapper } from '@/containers/section/components/section-wrapper';

import { Slider, SliderPauseButton, SliderProvider } from '@/features/slider/';

// Component(s)
export const Hero8 = () => {
	// Render default
	return (
		<SliderProvider>
			<SectionWrapper classNameContainer="flex flex-col items-stretch gap-24">
				<div data-slot="section-row">
					<div data-slot="section-col" className="mx-auto flex max-w-5xl flex-col items-center">
						<div data-slot="section-text-wrapper" className="z-10 items-center text-center">
							<h1 className="mb-8 text-4xl font-semibold text-pretty lg:text-7xl">Build faster with Shadcnblocks</h1>
							<p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi
								consequatur. Explicabo.
							</p>
							<div className="mt-12 flex w-full flex-col justify-center gap-2 sm:flex-row">
								<Button>
									Get started now
									<ChevronRight className="ml-2 h-4" />
								</Button>
								<Button variant="ghost">
									Learn more
									<ChevronRight className="ml-2 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div data-slot="section-row">
					<div data-slot="section-col">
						{/* Media Slider */}
						<div data-slot="section-slider-wrapper" className="flex flex-col items-stretch w-dvw -mx-4 gap-6 lg:-mx-6">
							<Slider animation="auto-scroll" loop>
								<div data-slot="section-slide">
									<div data-slot="section-slide-row" className="px-4 lg:px-6">
										<img
											data-slot="section-slide-img"
											className="block w-full max-w-7xl max-h-[700px] mx-auto rounded-lg object-cover"
											src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
											alt="placeholder"
										/>
									</div>
								</div>
								<div data-slot="section-slide">
									<div data-slot="section-slide-row" className="px-4 lg:px-6">
										<img
											data-slot="section-slide-img"
											className="block w-full max-w-7xl max-h-[700px] mx-auto rounded-lg object-cover"
											src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
											alt="placeholder"
										/>
									</div>
								</div>
								<div data-slot="section-slide">
									<div data-slot="section-slide-row" className="px-4 lg:px-6">
										<img
											data-slot="section-slide-img"
											className="block w-full max-w-7xl max-h-[700px] mx-auto rounded-lg object-cover"
											src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
											alt="placeholder"
										/>
									</div>
								</div>
							</Slider>
							<div data-slot="section-slider-controls" className="px-4 lg:px-6">
								<div data-slot="section-slider-controls-row" className="flex justify-betweenmax-w-screen-2xl mx-auto">
									<SliderPauseButton />
								</div>
							</div>
						</div>
					</div>
				</div>
			</SectionWrapper>
		</SliderProvider>
	);
};
