/**
 * @component Button
 * @filepath /components/ui/button.tsx
 * @description This component renders a button with various styles and sizes using Radix UI and Class
 */

// TODO: Add Suffix and Prefix icons to the button component

// Imports - types / config
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { configButtonThemes } from '@/config/themes';

// Imports - scripts (node)
import { cva } from 'class-variance-authority';

// Imports - scripts (local)
import { cn } from '@/lib/utils';

// Imports - components (node)
import { Slot } from '@radix-ui/react-slot';

// Types
export type ButtonThemes = {
	[key in keyof typeof buttonThemes]: string;
};

// Settings
export const buttonThemes: {
	[key: keyof typeof configButtonThemes]: string;
} = {
	default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
	accent: 'bg-accent text-accent-foreground shadow-xs hover:bg-accent/80',
	destructive:
		'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
	outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
	secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
	ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
	link: 'text-primary underline-offset-4 hover:underline',
};

export const buttonSizes = {
	default: 'h-9 px-4 py-2 has-[>svg]:px-3',
	sm: 'h-8 rounded gap-1.5 px-3 has-[>svg]:px-2.5',
	lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
	xl: 'h-11 rounded-md px-8 has-[>svg]:px-6',
	icon: 'size-9 rounded-full',
	iconSm: 'size-8 rounded-full',
	iconLg: 'size-10 rounded-full',
	iconXl: 'size-11 rounded-full',
};

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-4 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: buttonThemes,
			size: buttonSizes,
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

// Component(s)
function Button({
	variant,
	size,
	asChild = false,
	className,
	...rest
}: ComponentProps<'button'> &
	// Init
	VariantProps<typeof buttonVariants> & {
		variant?: keyof typeof buttonThemes;
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';

	// Render default
	return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...rest} />;
}

export { Button, buttonVariants };
