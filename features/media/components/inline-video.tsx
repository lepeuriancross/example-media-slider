/**
 * @component InlineVideo
 * @filepath /features/media/components/inline-video.tsx
 * @description This component renders an inline video player with controls,
 */

'use client';

// Imports - types / config
import type { RootState } from '@/redux/store';

// Imports - scripts (node)
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, Ref } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Imports - scripts (local)
import { cn } from '@/lib/utils';
import { setCurrentlyPlaying } from '@/features/media/store/media-slice';

// Imports - components (node)
import ReactPlayer from 'react-player';

// Imports - components (local)
import { CoverAspectBox } from '@/components/ui/cover-aspect-box';
import { LoadingIcon } from '@/components/ui/loading-icon';

// Types
export type VideoPlayerProps = {
	data?: VideoPlayerData;
	className?: string;
	onReady?: () => void;
	onPlay?: () => void;
	onPause?: () => void;
};

export type VideoPlayerData = {
	_type: 'video';
	variant?: 'none' | 'url' | 'brightcove' | 'youtube';
	aspectRatio?: '9/16' | '1/1' | '16/9' | '21/9';
	thumbnailStyle?: 'default' | 'posterVideo';
	metaTitle?: string;
} & (
	| {
			variant: 'none';
	  }
	| {
			variant: 'brightcove';
			id: string;
	  }
	| {
			variant: 'url';
			src: string;
	  }
	| {
			variant: 'youtube';
			id: string;
	  }
);

export type VideoPlayerHandle = {
	play: (args: { id: string }) => void;
	pause: (args: { id: string }) => void;
	fastSeek: (seconds: number) => void;
};

// Settings
const aspectRatioPadding = {
	default: '56.25%',
	'9/16': '177.78%',
	'1/1': '100%',
	'16/9': '56.25%',
	'21/9': '42.86%',
};

// Component(s)
const VideoPlayer = forwardRef(({ data, className, onReady, onPlay, onPause }: VideoPlayerProps, ref: Ref<VideoPlayerHandle>) => {
	// Refs
	const playerId = useRef<string>(null);
	const playerRef = useRef<any>(null);

	// Store
	const dispatch = useDispatch();
	const currentlyPlaying = useSelector((state: RootState) => state.media.currentlyPlaying);

	// State
	const [error, setError] = useState<string | null>(null);
	const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [src, setSrc] = useState<string | null>(null);

	// Functions
	const play = () => {
		setIsPlaying(true);
	};

	const pause = () => {
		setIsPlaying(false);
	};

	const fastSeek = (seconds: number) => {
		// console.log('Seeking to:', seconds, playerRef.current);
		// // If no player is available, return early
		if (!playerRef.current) return;

		// Seek to the specified time
		playerRef.current.currentTime = seconds;
	};

	// Hooks
	useEffect(() => {
		// Set player ID
		playerId.current = `video-player-${uuidv4()}`;
	}, []);

	useEffect(() => {
		// Defaults
		let isActive = true;

		// If no data is provided, return early
		if (!data) return;

		// Functions
		const bail = (msg: string) => {
			console.error(msg);
			if (isActive) setError(msg);
		};

		// Switch - video variant
		switch (data.variant) {
			// Plain URL
			case 'url': {
				// Log
				if (!data.src) return bail('No video source URL provided.');

				// Set video source
				setSrc(data.src);

				break;
			}

			// Brightcove
			case 'brightcove': {
				// Log
				if (!data.id) return bail('No Brightcove video ID provided.');

				(async () => {
					try {
						// Set loading state
						if (isActive) setLoading(true);

						// Fetch Brightcove video URL
						const res = await fetch(`/api/media/get-brightcove-video/${data.id}`, { cache: 'no-store' });

						// If response is not ok, throw an error
						if (!res.ok) throw new Error(await res.text());

						// Parse JSON response
						const json: { src: string } = await res.json();

						// Set video source
						if (isActive) setSrc(json.src);
					} catch {
						// Bail with error
						bail('Unable to load Brightcove video.');
					} finally {
						// Set loading state
						if (isActive) setLoading(false);
					}
				})();
				break;
			}

			// YouTube
			case 'youtube': {
				// If no ID provided, bail
				if (!data.id) return bail('No YouTube video ID provided.');

				// Set video source
				setSrc(`https://www.youtube.com/watch?v=${data.id}`);
				break;
			}

			// None
			case 'none':
				break;

			// Default
			default:
				bail('Unsupported video variant.');
		}

		// Cleanup
		return () => {
			isActive = false;
		};
	}, [data]);

	useEffect(() => {
		if (currentlyPlaying !== playerId.current) {
			// Pause the video
			pause();

			// Reset to first play state
			fastSeek(0);

			// Reset is first play state
			setIsFirstPlay(true);
		}
	}, [currentlyPlaying]);

	// Handlers
	const handlePosterClick = () => {
		// Play the video
		play();
	};

	const handlePlay = () => {
		// Dispatch as currently playing video
		if (playerId.current) {
			dispatch(setCurrentlyPlaying(playerId.current));
		}

		// Callback
		onPlay?.();
	};

	const handlePause = () => {
		// Callback
		onPause?.();
	};

	// Imperative handle
	useImperativeHandle(ref, () => ({
		play,
		pause,
		fastSeek,
	}));

	// If no source is available, render a loading state
	if (!src)
		return (
			<div data-slot="inline-player" id={playerId.current ?? undefined} className={cn(`relative w-full overflow-hidden`, className)}>
				<div
					data-slot="inline-player-padding"
					className="relative z-10 w-full"
					style={{
						paddingTop:
							data?.aspectRatio && data.aspectRatio in aspectRatioPadding ? aspectRatioPadding[data.aspectRatio] : aspectRatioPadding.default,
					}}
				/>
				<LoadingIcon className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10" label="Loading video..." />
			</div>
		);

	// Render default
	return (
		<div data-slot="inline-player" id={playerId.current ?? undefined} className={cn(`relative w-full overflow-hidden`, className)}>
			<div
				data-slot="inline-player-padding"
				className="relative z-10 w-full"
				style={{
					paddingTop: data?.aspectRatio && data.aspectRatio in aspectRatioPadding ? aspectRatioPadding[data.aspectRatio] : aspectRatioPadding.default,
				}}
			/>
			<ReactPlayer
				ref={playerRef}
				src={src}
				controls
				playing={isPlaying}
				style={{
					position: 'absolute',
					zIndex: 20,
					top: 0,
					left: 0,
				}}
				width="100%"
				height="100%"
				onPlay={handlePlay}
				onPause={handlePause}
			/>
			{isFirstPlay && !isPlaying && (
				<>
					{data?.thumbnailStyle === 'posterVideo' && (
						<VideoPlayerPosterVideo src={src} aspectRatio={data?.aspectRatio ?? '16/9'} onClick={handlePosterClick} />
					)}
				</>
			)}
		</div>
	);
});

export function VideoPlayerPosterVideo({ src, aspectRatio = '16/9', onClick }: { src?: string; aspectRatio?: string; onClick?: () => void }) {
	// If no source is provided, render null
	if (!src) return null;

	// Render default
	return (
		<button
			data-slot="inline-player-poster-video"
			className="absolute z-20 flex flex-col justify-center items-center inset-0 group cursor-pointer"
			onClick={onClick}
		>
			<CoverAspectBox
				aspect={aspectRatio.split('/').map(Number) as [number, number]}
				className={cn('video-player__thumbnail-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2')}
			>
				<ReactPlayer src={src} playing={true} loop={true} muted={true} controls={false} width="100%" height="100%" />
			</CoverAspectBox>
			<VideoPlayerPosterIcon className="relative z-20" />
		</button>
	);
}

export function VideoPlayerPosterIcon({ className }: { className?: string }) {
	// Render default
	return (
		<div
			data-slot="inline-player-poster-icon"
			className={cn(
				`video-player__thumbnail-icon w-20 flex flex-col justify-center items-center aspect-square rounded-full transition-all duration-300 ease-out text-primary-foreground group-hover:scale-110 bg-primary`,
				className,
			)}
		>
			<span className="sr-only">Play Video</span>
			<svg className="w-[40%] h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path
					fillRule="evenodd"
					d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
					clipRule="evenodd"
				/>
			</svg>
		</div>
	);
}

VideoPlayer.displayName = 'VideoPlayer';
export { VideoPlayer };
