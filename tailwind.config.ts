import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#F5F0E8',
          elevated: '#FFFDF7',
          sunken: '#EDE7DA',
        },
        ink: {
          900: '#3C3428',
          600: '#8B7E6E',
          400: '#B8AFA0',
        },
        line: {
          soft: '#E8E0D5',
        },
        brand: {
          warm: '#C28B4E',
          'warm-deep': '#8B5E34',
          paper: '#FDF6ED',
          clay: '#D4956A',
        },
        success: '#8BA67C',
        warning: '#D4A84B',
        danger: '#D4956A',
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 2px 12px rgba(60,52,40,.06)',
        md: '0 6px 24px rgba(60,52,40,.08)',
        lg: '0 12px 40px rgba(60,52,40,.10)',
      },
      fontFamily: {
        display: ['Noto Serif SC', 'STSongti-SC', 'Songti SC', 'serif'],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'Hiragino Sans GB',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['40px', { lineHeight: '1.15', fontWeight: '500' }],
        h1: ['28px', { lineHeight: '1.25', fontWeight: '500' }],
        h2: ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        h3: ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['17px', { lineHeight: '1.7', fontWeight: '400' }],
        body: ['15px', { lineHeight: '1.7', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      backgroundImage: {
        'paper-warm': 'linear-gradient(180deg, #F5F0E8 0%, #EDE5D8 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
