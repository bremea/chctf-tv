<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let table: string[][] = [];

	const randomChars = '!@#$%^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const end = new Date('04/27/2024 1:30 PM');
	let scoreboard: HTMLDivElement;
	let scoreTable: HTMLTableElement;
	const sponsors = [
		'https://chctf.com/files/sponsors/Brown_Advisory.jpg',
		'https://chctf.com/files/sponsors/Sophos.png',
		'https://chctf.com/files/sponsors/1stsource.jpg',
		'https://chctf.com/files/sponsors/CTI.png',
		'https://chctf.com/files/sponsors/cisco.png',
		'https://chctf.com/files/sponsors/Jovian_Concepts.jpg'
	];

	let currentSponsor = 0;
	let millisecondsLeft: number = 0;
	let secondsLeft: number = 0;
	let minutesLeft: number = 0;
	let hoursLeft: number = 0;
	let tableOpacity: number = 0;
	let now = new Date();

	let scores: { name: string; score: number }[] = [];

	onMount(async () => {
		for (let y = 0; y < visualViewport?.height! / 29.15; y++) {
			table[y] = [];
			for (let x = 0; x < visualViewport?.width! / 13.25; x++) {
				table[y][x] = '.';
			}
		}

		setInterval(() => {
			let x = Math.floor(Math.random() * table[0].length);
			let y = Math.floor(Math.random() * table.length);
			runAnimation(x, y);
		}, 30);

		while (true) {
			await runScoreboard();
		}
	});

	const fetchScores = async () => {
		const req = await fetch('/scores');
		scores = (await req.json()).data;
	};

	const runScoreboard = async () => {
		scoreboard.scrollTo(0, 0);
		tableOpacity = 0;
		scoreTable.style.opacity = tableOpacity.toString();

		await fetchScores();

		while (tableOpacity < 1) {
			tableOpacity = tableOpacity + 0.05;
			scoreTable.style.opacity = tableOpacity.toString();
			await sleep(30);
		}
		tableOpacity = 1;
		scoreTable.style.opacity = tableOpacity.toString();

		await sleep(5000);

		while (scoreboard.scrollTop < scoreboard.scrollHeight - scoreboard.clientHeight) {
			scoreboard.scrollTo(0, scoreboard.scrollTop + 1);
			await sleep(30);
		}

		await sleep(5000);

		while (tableOpacity > 0) {
			tableOpacity = tableOpacity - 0.05;
			scoreTable.style.opacity = tableOpacity.toString();
			await sleep(30);
		}
		tableOpacity = 0;
		scoreTable.style.opacity = tableOpacity.toString();
	};

	const runAnimation = async (x: number, y: number) => {
		let animlength = Math.floor(Math.random() * (75 - 5) + 5);
		for (let i = 0; i < animlength; i++) {
			table[y][x] = getRandomChar();
			await sleep(25);
		}
		table[y][x] = '.';
	};

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const getRandomChar = (): string => {
		return randomChars[Math.floor(Math.random() * randomChars.length)];
	};

	setInterval(() => {
		currentSponsor++;
		if (currentSponsor >= sponsors.length) currentSponsor = 0;
	}, 5000);

	setInterval(() => {
		now = new Date();
		const differenceInMilliseconds = end.getTime() - now.getTime();
		if (differenceInMilliseconds <= 0) {
			hoursLeft = 0;
			minutesLeft = 0;
			secondsLeft = 0;
			millisecondsLeft = 0;
			return;
		}

		hoursLeft = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
		minutesLeft = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
		secondsLeft = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);
		millisecondsLeft = Math.floor((differenceInMilliseconds % 1000) / 1);
	}, 10);
</script>

<div class="fixed z-10 w-full h-full flex flex-col justify-around items-center">
	{#if now > new Date('4/27/2024 10:00 AM')}
		<p class="shadow-red text-6xl tracking-widest opacity-100 special-red bg-black px-12 py-4">
			{hoursLeft.toString().padStart(2, '0')} : {minutesLeft.toString().padStart(2, '0')} : {secondsLeft
				.toString()
				.padStart(2, '0')} . {millisecondsLeft.toString().slice(0, 2).padStart(2, '0')}
		</p>
	{:else}
		<p class="shadow-red text-6xl tracking-widest opacity-100 special-red bg-black px-12 py-4">
			STARTING SOON...
		</p>
	{/if}
	<div
		class="bg-black w-1/2 flex justify-center px-8 py-4 h-64 overflow-y-hidden"
		bind:this={scoreboard}
	>
		<table class="text-2xl w-full align-middle" bind:this={scoreTable}>
			<tr>
				<th class="special-red font-normal">#</th>
				<th class="special-red font-normal">Team</th>
				<th class="text-right font-normal special-red">Points</th>
			</tr>
			{#each scores as score, i}
				<tr>
					<td class="special-red">{i + 1}</td>
					<td>{score.name}</td>
					<td class="text-right">{score.score}</td>
				</tr>
			{/each}
		</table>
	</div>
	<div class="h-[156px] w-[935px] flex justify-center relative">
		{#each sponsors as sponsor, i}
			{#if currentSponsor == i}
				<img
					class="h-[156px] bg-white p-4 absolute"
					src={sponsor}
					alt="sponsor"
					in:fade={{ delay: 250, duration: 250 }}
					out:fade={{ duration: 250 }}
				/>
			{/if}
		{/each}
	</div>
</div>

{#each table as str}
	<p class="text-2xl tracking-widest opacity-25">{str.join('')}</p>
{/each}
