import type { Config } from 'tailwindcss';
import tailwindCssAnimate from 'tailwindcss-animate';
// @ts-ignore
import tailwindCssReactAriaComponents from 'tailwindcss-react-aria-components';

const config: Config = {
	content: ['./app/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: (x) => ({
				primary: {
					50: '#E6F3FF',
					100: '#CCE6FF',
					200: '#99CEFF',
					300: '#67B5FE',
					400: '#349CFE',
					500: '#0384FE',
					600: '#0169CB',
					700: '#014F98',
					800: '#003566',
					900: '#001A33',
					950: '#000D19',
					DEFAULT: '#0384FE',
				},
				accent: {
					50: '#FFF2EB',
					100: '#FFE1D1',
					200: '#FFC3A3',
					300: '#FFA575',
					400: '#FF8847',
					500: '#FF6A1C',
					600: '#E04F00',
					700: '#A83B00',
					800: '#702700',
					900: '#381400',
					950: '#1F0B00',
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
		},
	},
	darkMode: ['class'],
	plugins: [
		tailwindCssAnimate,
		tailwindCssReactAriaComponents({ prefix: 'rac' }),
	],
};

export default config;
