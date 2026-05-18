/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05060A',
        surface: '#0B0D14',
        text: '#F5F5F7',
        muted: '#A1A1AA',
        accent: {
          from: '#7C5CFF',
          to: '#22D3EE',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
        'radial-fade':
          'radial-gradient(ellipse at top, rgba(124,92,255,0.18), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(124, 92, 255, 0.45)',
        'glow-cyan': '0 0 60px -10px rgba(34, 211, 238, 0.4)',
      },
      screens: {
        xs: '450px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'grid-drift': 'grid-drift 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        'grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};
