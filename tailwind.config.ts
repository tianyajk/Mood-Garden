import type { Config } from 'tailwindcss';

/**
 * Design Token 落地（对齐 视觉设计.md 第一/六节）。
 * 中性色 / 品牌色 / 情绪强调色 / 语义色 / 圆角 / 间距 / 投影 全量 token 化。
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 基础中性色（界面骨架·暖灰）
        bg: {
          base: '#FAF8F5',
          elevated: '#FFFFFF',
          sunken: '#F1ECE6',
        },
        ink: {
          900: '#2B2A28',
          600: '#6B655E',
          400: '#A8A199',
        },
        line: {
          soft: '#EAE4DC',
        },
        // 品牌主色
        brand: {
          green: '#7FB89B',
          'green-deep': '#4E8A6E',
          violet: '#A99BD4',
          glow: '#F6E7C1',
        },
        // 语义色（克制使用）
        success: '#7FB89B',
        warning: '#E6B450',
        danger: '#D9776F',
      },
      borderRadius: {
        sm: '12px',
        md: '20px',
        lg: '28px',
        full: '9999px',
      },
      spacing: {
        // 8pt 栅格补充
        '18': '4.5rem',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(75,138,110,.06)',
        md: '0 8px 24px rgba(75,138,110,.10)',
        glow: '0 0 40px rgba(246,231,193,.45)',
      },
      fontFamily: {
        display: ['Fraunces', 'Source Han Serif SC', 'Songti SC', 'serif'],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Microsoft YaHei',
          'Inter',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['48px', { lineHeight: '1.1', fontWeight: '500' }],
        h1: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        micro: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      backgroundImage: {
        'sky-day': 'linear-gradient(135deg, #7FB89B 0%, #8FA8CF 50%, #A99BD4 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
