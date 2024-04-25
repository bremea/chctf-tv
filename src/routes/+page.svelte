<script lang="ts">
	let table: string[][] = [];

	let randomChars = '!@#$%^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
		let animlength = Math.floor(Math.random() * (24 - 12) + 12);
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
</script>
<p class="text-2xl tracking-widest opacity-100 special-red">02 : 22 : 25 . 202</p>
{#each table as str}
	<p class="text-2xl tracking-widest opacity-15">{str.join('')}</p>
{/each}
