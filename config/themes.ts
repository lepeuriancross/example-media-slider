/**
 * @name: Themes Config
 * @filepath /studio/config/themes.ts
 * @description This file contains the configuration for themes used in the application. It defines the available themes and their titles.
 */

// Themes
export const configButtonThemes: {
	[key: string]: {
		title: string;
	};
} = {
	default: {
		title: 'Default',
	},
	accent: {
		title: 'Accent',
	},
	destructive: {
		title: 'Destructive',
	},
	outline: {
		title: 'Outline',
	},
	secondary: {
		title: 'Secondary',
	},
	ghost: {
		title: 'Ghost',
	},
	link: {
		title: 'Link',
	},
};
