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
      colors: {
        accent: {
          50: '#E1EEFF',
          100: '#C7E0FE',
          200: '#8BBFFE',
          300: '#53A0FD',
          400: '#1C81FD',
          500: '#0265DC',
          600: '#0250B1',
          700: '#013C83',
          800: '#012756',
          900: '#00152D',
          950: '#000914',
        },
        negative: {
          50: '#FDE3E3',
          100: '#FBCCCB',
          200: '#F79A97',
          300: '#F36763',
          400: '#EF352E',
          500: '#D31510',
          600: '#AB120D',
          700: '#800E0A',
          800: '#550906',
          900: '#2B0503',
          950: '#130201',
        },
        positive: {
          50: '#D6FFDB',
          100: '#B3FFBB',
          200: '#66FF78',
          300: '#1AFF34',
          400: '#00C717',
          500: '#007C0F',
          600: '#00610B',
          700: '#004D09',
          800: '#003306',
          900: '#001903',
          950: '#000A01',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D4D4D4',
          300: '#BDBDBD',
          400: '#A6A6A6',
          500: '#909090',
          600: '#737373',
          700: '#575757',
          800: '#3B3B3B',
          900: '#1C1C1C',
          950: '#0F0F0F',
        },
        // neutral: {
        //   0: '#FFFFFF',
        //   50: '#F9FAFA',
        //   100: '#E9EBED',
        //   200: '#CDD1D6',
        //   300: '#AEB5BC',
        //   400: '#929BA5',
        //   500: '#737F8C',
        //   600: '#5A636D',
        //   700: '#434A51',
        //   800: '#292E32',
        //   900: '#121416',
        //   950: '#050506',
        // },
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
    tailwindCssAnimate,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    tailwindCssReactAriaComponents({ prefix: 'rac' }),
  ],
};

export default config;
