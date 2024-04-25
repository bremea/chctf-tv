<script lang="ts">
	import { fade } from 'svelte/transition';

	let table: string[][] = [];

	const randomChars = '!@#$%^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const end = new Date('04/27/2024 2:00 PM');
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
	}, 100);

	const runAnimation = async (x: number, y: number) => {
		let animlength = Math.floor(Math.random() * (50 - 25) + 25);
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
		const now = new Date();
		const differenceInMilliseconds = end.getTime() - now.getTime();

		hoursLeft = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
		minutesLeft = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
		secondsLeft = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);
		millisecondsLeft = Math.floor((differenceInMilliseconds % 1000) / 1);
	}, 10);
</script>

<div class="fixed z-10 w-full h-full flex flex-col justify-around items-center">
	<p class="shadow-red text-4xl tracking-widest opacity-100 special-red bg-black px-24 py-6">
		{hoursLeft.toString().padStart(2, '0')} : {minutesLeft.toString().padStart(2, '0')} : {secondsLeft
			.toString()
			.padStart(2, '0')} . {millisecondsLeft.toString().slice(0, 2).padStart(2, '0')}
	</p>
	<div class="bg-black w-1/2 h-96 flex items-center justify-center">
		<p class="opacity-25 text-xl">[scoreboard]</p>
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
	<p class="text-2xl tracking-widest opacity-15">{str.join('')}</p>
{/each}
