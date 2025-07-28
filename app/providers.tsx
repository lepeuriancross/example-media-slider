/**
 * @component Providers
 * @filepath /dash/app/providers.tsx
 * @description This file sets up the providers for the application, including Redux and any other necessary providers.
 */

'use client';

// Imports - scripts (node)
import { Provider } from 'react-redux';

// Imports - scripts (local)
import { store } from '@/redux/store';

// Component(s)(s)
export function Providers({ children }: { children: React.ReactNode }) {
	// Render default
	return <Provider store={store}>{children}</Provider>;
}
