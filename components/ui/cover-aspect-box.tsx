/**
 * @component CoverAspectBox
 * @filepath /template-brand-site/components/ui/cover-aspect-box.tsx
 * @description A React component that maintains a specific aspect ratio for its children, centering them within a box that scales responsively.
 */

'use client';

// Imports - scripts (node)
import { useRef, useState, useEffect } from 'react';

// Imports - scripts (local)
import { cn } from '@/lib/utils';

// Functions
export function CoverAspectBox({ aspect = [16, 9], className, children }: { aspect?: [number, number]; className?: string; children: React.ReactNode }) {
	// Refs
	const parentRef = useRef<HTMLDivElement>(null);

	// State
	const [scaleStyle, setScaleStyle] = useState({});

	// Hooks
	useEffect(() => {
		// If no container ref, return
		if (!parentRef.current) return;

		// Get container element
		const parentEl = parentRef.current;

		// Functions
		const resize = () => {
			const parentWidth = parentEl.clientWidth;
			const parentHeight = parentEl.clientHeight;

			let scaledWidth = parentWidth;
			let scaleHeight = (parentWidth / aspect[0]) * aspect[1];

			if (scaleHeight < parentHeight) {
				scaleHeight = parentHeight;
				scaledWidth = (parentHeight / aspect[1]) * aspect[0];
			}

			setScaleStyle({
				position: 'absolute' as const,
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				width: `${scaledWidth}px`,
				height: `${scaleHeight}px`,
			});
		};

		// Create and observe resize
		const observer = new ResizeObserver(resize);
		observer.observe(parentEl);

		// Initial call
		resize();

		// Cleanup
		return () => {
			observer.disconnect();
		};
	}, [aspect]);

	// Render default
	return (
		<div ref={parentRef} className={cn(`cover-aspect-box relative w-full h-full overflow-hidden`, className)}>
			<div className="cover-aspect-box__container" style={scaleStyle}>
				{children}
			</div>
		</div>
	);
}
