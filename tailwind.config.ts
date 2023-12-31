import type { Config } from 'tailwindcss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import tailwindCssReactAriaComponents from 'tailwindcss-react-aria-components';
import { withAnimations } from 'animated-tailwindcss';
import tailwindCssTypography from '@tailwindcss/typography';

const fontFamilyBase =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    colors: (utils) => ({
      inherit: utils.colors.inherit,
      current: utils.colors.current,
      transparent: utils.colors.transparent,
    }),
    extend: {
      colors: {
        primary: {
          0: 'hsl(var(--theme-primary-0) / <alpha-value>)',
          50: 'hsl(var(--theme-primary-50) / <alpha-value>)',
          100: 'hsl(var(--theme-primary-100) / <alpha-value>)',
          200: 'hsl(var(--theme-primary-200) / <alpha-value>)',
          300: 'hsl(var(--theme-primary-300) / <alpha-value>)',
          400: 'hsl(var(--theme-primary-400) / <alpha-value>)',
          500: 'hsl(var(--theme-primary-500) / <alpha-value>)',
          600: 'hsl(var(--theme-primary-600) / <alpha-value>)',
          700: 'hsl(var(--theme-primary-700) / <alpha-value>)',
          800: 'hsl(var(--theme-primary-800) / <alpha-value>)',
          900: 'hsl(var(--theme-primary-900) / <alpha-value>)',
          950: 'hsl(var(--theme-primary-950) / <alpha-value>)',
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
        positive: {
          50: 'hsl(var(--theme-positive-50) / <alpha-value>)',
          100: 'hsl(var(--theme-positive-100) / <alpha-value>)',
          200: 'hsl(var(--theme-positive-200) / <alpha-value>)',
          300: 'hsl(var(--theme-positive-300) / <alpha-value>)',
          400: 'hsl(var(--theme-positive-400) / <alpha-value>)',
          500: 'hsl(var(--theme-positive-500) / <alpha-value>)',
          600: 'hsl(var(--theme-positive-600) / <alpha-value>)',
          700: 'hsl(var(--theme-positive-700) / <alpha-value>)',
          800: 'hsl(var(--theme-positive-800) / <alpha-value>)',
          900: 'hsl(var(--theme-positive-900) / <alpha-value>)',
          950: 'hsl(var(--theme-positive-950) / <alpha-value>)',
        },
        negative: {
          50: 'hsl(var(--theme-negative-50) / <alpha-value>)',
          100: 'hsl(var(--theme-negative-100) / <alpha-value>)',
          200: 'hsl(var(--theme-negative-200) / <alpha-value>)',
          300: 'hsl(var(--theme-negative-300) / <alpha-value>)',
          400: 'hsl(var(--theme-negative-400) / <alpha-value>)',
          500: 'hsl(var(--theme-negative-500) / <alpha-value>)',
          600: 'hsl(var(--theme-negative-600) / <alpha-value>)',
          700: 'hsl(var(--theme-negative-700) / <alpha-value>)',
          800: 'hsl(var(--theme-negative-800) / <alpha-value>)',
          900: 'hsl(var(--theme-negative-900) / <alpha-value>)',
          950: 'hsl(var(--theme-negative-950) / <alpha-value>)',
        },
        info: {
          50: 'hsl(var(--theme-info-50) / <alpha-value>)',
          100: 'hsl(var(--theme-info-100) / <alpha-value>)',
          200: 'hsl(var(--theme-info-200) / <alpha-value>)',
          300: 'hsl(var(--theme-info-300) / <alpha-value>)',
          400: 'hsl(var(--theme-info-400) / <alpha-value>)',
          500: 'hsl(var(--theme-info-500) / <alpha-value>)',
          600: 'hsl(var(--theme-info-600) / <alpha-value>)',
          700: 'hsl(var(--theme-info-700) / <alpha-value>)',
          800: 'hsl(var(--theme-info-800) / <alpha-value>)',
          900: 'hsl(var(--theme-info-900) / <alpha-value>)',
          950: 'hsl(var(--theme-info-950) / <alpha-value>)',
        },
        surface: {
          1: 'hsl(var(--theme-surface-1) / <alpha-value>)',
          2: 'hsl(var(--theme-surface-2) / <alpha-value>)',
        },
        black: '#000000',
      },
      fontSize: {
        xs: '0.79rem',
        sm: '0.889rem',
        base: '1rem',
        md: '1.125rem',
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
        display: ["'Inter Tight Variable'", fontFamilyBase],
        'sans-serif': ["'Inter Tight Variable'", fontFamilyBase],
      },
      lineHeight: {
        body: '1.75',
        heading: '1.3',
      },
      typography: ({ theme }) => ({
        primary: {
          css: {
            '--tw-prose-body': theme('colors.primary[900] / 1'),
            '--tw-prose-headings': theme('colors.primary[950] / 1'),
            '--tw-prose-lead': theme('colors.primary[700] / 1'),
            '--tw-prose-links': theme('colors.info[500] / 1'),
            '--tw-prose-bold': theme('colors.primary[950] / 1'),
            '--tw-prose-counters': theme('colors.primary[700] / 1'),
            '--tw-prose-bullets': theme('colors.primary[700] / 1'),
            '--tw-prose-hr': theme('colors.primary[200] / 1'),
            '--tw-prose-quotes': theme('colors.primary[900] / 1'),
            '--tw-prose-quote-borders': theme('colors.primary[200] / 1'),
            '--tw-prose-captions': theme('colors.primary[700] / 1'),
            '--tw-prose-code': theme('colors.primary[900] / 1'),
            '--tw-prose-pre-code': theme('colors.primary[50] / 1'),
            '--tw-prose-pre-bg': theme('colors.primary[700] / 1'),
            '--tw-prose-th-borders': theme('colors.primary[200] / 1'),
            '--tw-prose-td-borders': theme('colors.primary[200] / 1'),
            // '--tw-prose-invert-body': theme('colors.primary[200] / 1'),
            // '--tw-prose-invert-headings': theme('colors.primary[50] / 1'),
            // '--tw-prose-invert-lead': theme('colors.primary[300] / 1'),
            // '--tw-prose-invert-links': theme('colors.primary[50] / 1'),
            // '--tw-prose-invert-bold': theme('colors.primary[50] / 1'),
            // '--tw-prose-invert-counters': theme('colors.primary[400] / 1'),
            // '--tw-prose-invert-bullets': theme('colors.primary[600] / 1'),
            // '--tw-prose-invert-hr': theme('colors.primary[700] / 1'),
            // '--tw-prose-invert-quotes': theme('colors.primary[100] / 1'),
            // '--tw-prose-invert-quote-borders': theme('colors.primary[700] / 1'),
            // '--tw-prose-invert-captions': theme('colors.primary[400] / 1'),
            // '--tw-prose-invert-code': theme('colors.primary[50] / 1'),
            // '--tw-prose-invert-pre-code': theme('colors.primary[300] / 1'),
            // '--tw-prose-invert-pre-bg': theme('colors.primary[700] / 1'),
            // '--tw-prose-invert-th-borders': theme('colors.primary[600] / 1'),
            // '--tw-prose-invert-td-borders': theme('colors.primary[700] / 1'),
          },
        },
      }),
    },
  },
  darkMode: ['class'],
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    tailwindCssReactAriaComponents({
      target: 'modern',
    }),
    tailwindCssTypography,
  ],
};

export default withAnimations(config as any);
