import { TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const req = await fetch('https://chctf.com/api/v1/scoreboard', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Token ${TOKEN}`
		}
	});

	const res = await req.json();
	return json(res);
}
