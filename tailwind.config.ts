import type { Config } from 'tailwindcss';
import tailwindCssAnimate from 'tailwindcss-animate';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tailwindCssReactAriaComponents from 'tailwindcss-react-aria-components';

const fontFamilyBase =
	"system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

const config: Config = {
	content: ['./app/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: (x) => ({
				primary: {
					50: '#EBE8FD',
					100: '#D7D1FA',
					200: '#B3A7F6',
					300: '#8B78F2',
					400: '#664FEE',
					500: '#3E20E9',
					600: '#2E13C3',
					700: '#220E90',
					800: '#170A61',
					900: '#0B052E',
					950: '#050217',
				},
				accent: {
					50: '#FCF6E8',
					100: '#FAEED6',
					200: '#F6DDAC',
					300: '#F1CB7E',
					400: '#ECBA55',
					500: '#E8AA2C',
					600: '#C68B16',
					700: '#936710',
					800: '#65470B',
					900: '#332406',
					950: '#171003',
				},
				negative: {
					50: '#FDE7E7',
					100: '#FBCBCB',
					200: '#F89B9B',
					300: '#F46767',
					400: '#F13737',
					500: '#E01010',
					600: '#B50D0D',
					700: '#850909',
					800: '#5A0606',
					900: '#2B0303',
					950: '#180202',
				},
				neutral: {
					...x.colors.neutral,
					0: '#FFFFFF',
				},
			}),
			fontSize: {
				xs: '0.79rem',
				sm: '0.889rem',
				base: '1rem',
				md: '1.125',
				lg: '1.266rem',
				xl: '1.424rem',
				'2xl': '1.602rem',
				'3xl': '1.802rem',
				'4xl': '2.027rem',
				'5xl': '2.281rem',
				'6xl': '2.566rem',
				'7xl': '2.887rem',
				'8xl': '3.247rem',
				'9xl': '3.653rem',
			},
			fontFamily: {
				display: ["'Source Sans 3'", fontFamilyBase],
				'sans-serif': ["'Source Sans 3'", fontFamilyBase],
			},
			lineHeight: {
				body: '1.75',
				heading: '1.3',
			},
		},
	},
	darkMode: ['class'],
	plugins: [
		tailwindCssAnimate,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		tailwindCssReactAriaComponents({ prefix: 'rac' }),
	],
};

export default config;
