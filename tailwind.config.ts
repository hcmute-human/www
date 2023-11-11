import type { Config } from 'tailwindcss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tailwindCssReactAriaComponents from 'tailwindcss-react-aria-components';
import { withAnimations } from 'animated-tailwindcss';

const fontFamilyBase =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          0: 'color(display-p3 var(--theme-primary-0) / <alpha-value>)',
          50: 'color(display-p3 var(--theme-primary-50) / <alpha-value>)',
          100: 'color(display-p3 var(--theme-primary-100) / <alpha-value>)',
          200: 'color(display-p3 var(--theme-primary-200) / <alpha-value>)',
          300: 'color(display-p3 var(--theme-primary-300) / <alpha-value>)',
          400: 'color(display-p3 var(--theme-primary-400) / <alpha-value>)',
          500: 'color(display-p3 var(--theme-primary-500) / <alpha-value>)',
          600: 'color(display-p3 var(--theme-primary-600) / <alpha-value>)',
          700: 'color(display-p3 var(--theme-primary-700) / <alpha-value>)',
          800: 'color(display-p3 var(--theme-primary-800) / <alpha-value>)',
          900: 'color(display-p3 var(--theme-primary-900) / <alpha-value>)',
          950: 'color(display-p3 var(--theme-primary-950) / <alpha-value>)',
        },
        accent: {
          50: 'hsl(var(--theme-accent-50) / <alpha-value>)',
          100: 'hsl(var(--theme-accent-100) / <alpha-value>)',
          200: 'hsl(var(--theme-accent-200) / <alpha-value>)',
          300: 'hsl(var(--theme-accent-300) / <alpha-value>)',
          400: 'hsl(var(--theme-accent-400) / <alpha-value>)',
          500: 'hsl(var(--theme-accent-500) / <alpha-value>)',
          600: 'hsl(var(--theme-accent-600) / <alpha-value>)',
          700: 'hsl(var(--theme-accent-700) / <alpha-value>)',
          800: 'hsl(var(--theme-accent-800) / <alpha-value>)',
          900: 'hsl(var(--theme-accent-900) / <alpha-value>)',
          950: 'hsl(var(--theme-accent-950) / <alpha-value>)',
        },
        negative: {
          50: 'color(display-p3 var(--theme-negative-50) / <alpha-value>)',
          100: 'color(display-p3 var(--theme-negative-100) / <alpha-value>)',
          200: 'color(display-p3 var(--theme-negative-200) / <alpha-value>)',
          300: 'color(display-p3 var(--theme-negative-300) / <alpha-value>)',
          400: 'color(display-p3 var(--theme-negative-400) / <alpha-value>)',
          500: 'color(display-p3 var(--theme-negative-500) / <alpha-value>)',
          600: 'color(display-p3 var(--theme-negative-600) / <alpha-value>)',
          700: 'color(display-p3 var(--theme-negative-700) / <alpha-value>)',
          800: 'color(display-p3 var(--theme-negative-800) / <alpha-value>)',
          900: 'color(display-p3 var(--theme-negative-900) / <alpha-value>)',
          950: 'color(display-p3 var(--theme-negative-950) / <alpha-value>)',
        },
        positive: {
          50: 'color(display-p3 var(--theme-positive-50) / <alpha-value>)',
          100: 'color(display-p3 var(--theme-positive-100) / <alpha-value>)',
          200: 'color(display-p3 var(--theme-positive-200) / <alpha-value>)',
          300: 'color(display-p3 var(--theme-positive-300) / <alpha-value>)',
          400: 'color(display-p3 var(--theme-positive-400) / <alpha-value>)',
          500: 'color(display-p3 var(--theme-positive-500) / <alpha-value>)',
          600: 'color(display-p3 var(--theme-positive-600) / <alpha-value>)',
          700: 'color(display-p3 var(--theme-positive-700) / <alpha-value>)',
          800: 'color(display-p3 var(--theme-positive-800) / <alpha-value>)',
          900: 'color(display-p3 var(--theme-positive-900) / <alpha-value>)',
          950: 'color(display-p3 var(--theme-positive-950) / <alpha-value>)',
        },
      },
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    tailwindCssReactAriaComponents({
      target: 'modern',
    }),
  ],
};

export default withAnimations(config as any);
