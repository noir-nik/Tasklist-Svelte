/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	// darkMode: 'media',
	darkMode: ['class'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: 'oklch(var(--primary) / <alpha-value>)',
			},
		},
	},
	plugins: [],
};
