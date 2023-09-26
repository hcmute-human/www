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
          50: '#E8F2FD',
          100: '#D0E4FB',
          200: '#A1C9F7',
          300: '#72AEF3',
          400: '#4393EF',
          500: '#1478EB',
          600: '#1060BC',
          700: '#0C488D',
          800: '#08305E',
          900: '#04182F',
          950: '#020C17',
        },
        negative: {
          50: '#FDE8E8',
          100: '#FBD0D0',
          200: '#F7A1A1',
          300: '#F37272',
          400: '#EF4343',
          500: '#EB1515',
          600: '#BC1010',
          700: '#8D0C0C',
          800: '#5E0808',
          900: '#2F0404',
          950: '#170202',
        },
        positive: {
          50: '#EAFDE8',
          100: '#D5FBD0',
          200: '#ABF7A1',
          300: '#81F372',
          400: '#57EF43',
          500: '#2EEB15',
          600: '#24BC10',
          700: '#1B8D0C',
          800: '#125E08',
          900: '#092F04',
          950: '#051702',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F9FAFA',
          100: '#E9EBED',
          200: '#CDD1D6',
          300: '#AEB5BC',
          400: '#929BA5',
          500: '#737F8C',
          600: '#5A636D',
          700: '#434A51',
          800: '#292E32',
          900: '#121416',
          950: '#050506',
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
