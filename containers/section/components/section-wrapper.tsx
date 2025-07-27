/**
 * @component SectionWrapper
 * @filepath /containers/section/components/section-wrapper.tsx
 * @description This component serves as a wrapper for section containers, providing a consistent layout and styling
 */

'use client';

// Imports - scripts (local)
import { cn } from '@/lib/utils';

// Types
export type SectionWrapperProps = {
	_idx?: number;
	id?: string;
	paddingTop?: boolean;
	paddingSides?: boolean;
	paddingBottom?: boolean;
	className?: string;
	classNameBg?: string;
	classNameContainer?: string;
	classNameFg?: string;
	children?: React.ReactNode;
	childrenBg?: React.ReactNode;
	childrenFg?: React.ReactNode;
};

// Component(s)
export function SectionWrapper({
	_idx = -1,
	id,
	paddingTop = true,
	paddingSides = true,
	paddingBottom = true,
	className,
	classNameBg,
	classNameContainer,
	classNameFg,
	children,
	childrenBg,
	childrenFg,
}: SectionWrapperProps) {
	// Render default
	return (
		<section data-slot="section-wrapper" id={id} className={cn('relative flex flex-col justify-center items-stretch', className)}>
			{childrenBg && (
				<div data-slot="section-wrapper-bg" className={cn(`absolute z-10 inset-0 pointer-events-none`, classNameBg)}>
					{childrenBg}
				</div>
			)}
			<div
				data-slot="section-wrapper-container"
				className={cn(
					`relative z-20 flex flex-col items-stretch`,
					paddingTop && _idx ? 'pt-20' : paddingTop && 'pt-4 lg:pt-6',
					paddingSides && 'px-4 lg:px-6',
					paddingBottom && 'pb-20',
					classNameContainer,
				)}
			>
				{children}
			</div>
			{childrenFg && (
				<div data-slot="section-wrapper-fg" className={cn(`absolute z-30 inset-0 pointer-events-none`, classNameFg)}>
					{childrenFg}
				</div>
			)}
		</section>
	);
}
