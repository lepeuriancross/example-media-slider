/**
 * @name: Get Brightcove Video API Route
 * @filepath /app/api/media/get-brightcove-video/[videoId]/route.ts
 * @description This API route fetches a Brightcove video by its ID and returns the video data in JSON format.
 */

// Imports - scripts (node)
import { NextRequest, NextResponse } from 'next/server';

// Route
export async function GET(
	req: NextRequest,
	context: { params: Promise<{ videoId: string }> }, // ← must be a Promise
) {
	const { videoId } = await context.params;

	const accountId = process.env.NEXT_PUBLIC_BRIGHTCOVE_ACCOUNT_ID;
	const policyKey = process.env.BRIGHTCOVE_POLICY_KEY;

	if (!accountId || !policyKey) {
		return NextResponse.json({ error: 'Brightcove env vars are missing' }, { status: 500 });
	}

	try {
		const bcUrl = `https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos/${videoId}`;

		const bcRes = await fetch(bcUrl, {
			// Passing the policy key in the Accept header is CORS-friendly and recommended :contentReference[oaicite:0]{index=0}
			headers: { Accept: `application/json;pk=${policyKey}` },
			// Never cache or you might hand out an expired URL
			cache: 'no-cache',
		});

		if (!bcRes.ok) {
			return NextResponse.json({ error: 'Brightcove request failed', detail: await bcRes.text() }, { status: bcRes.status });
		}

		type BrightcoveSource = {
			src: string;
			container: string;
			[key: string]: unknown;
		};
		const data: { sources?: BrightcoveSource[] } = await bcRes.json();

		// Prefer MP4; fall back to whatever the first source is.
		const chosenSource = data.sources?.find((s) => s.container === 'MP4' && s.src) ?? data.sources?.[0];

		if (!chosenSource?.src) {
			return NextResponse.json({ error: 'No playable source returned by Brightcove' }, { status: 404 });
		}

		return NextResponse.json({ src: chosenSource.src });
	} catch (err) {
		console.error('Brightcove API error', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
