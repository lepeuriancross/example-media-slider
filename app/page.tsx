/**
 * @component Home
 * @filepath /app/page.tsx
 * @description This component serves as the main entry point for the application, rendering the home page.
 */

// Imports - components (local)
import { Hero8 } from '@/containers/section/components/hero8';

// Component(s)
export default function Home() {
	return (
		<main data-slot="main-home">
			<Hero8 />
		</main>
	);
}
