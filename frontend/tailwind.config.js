/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F8FC',
        surface: '#ffffff',
        border: '#E2E8F0',
        'text-main': '#1A1C2A',
        muted: '#64748B',
        accent: {
          DEFAULT: '#4A7CF5',
          light: '#EEF3FE',
          dark: '#3366E0',
        },
        purple: {
          brand: '#7C5CFA',
          light: '#F0ECFE',
        },
        green: {
          brand: '#22C55E',
          light: '#DCFCE7',
        },
        amber: {
          brand: '#F59E0B',
          light: '#FEF3C7',
        },
        coral: {
          brand: '#EF4444',
          light: '#FEE2E2',
        },
        teal: {
          brand: '#14B8A6',
          light: '#CCFBF1',
        },
      },
      fontFamily: {
        sans: ['Onest', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(74,124,245,0.06), 0 8px 32px rgba(0,0,0,0.04)',
        lg: '0 4px 24px rgba(0,0,0,0.08)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(0px)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blobMove: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-15px) scale(1.05)' },
          '66%': { transform: 'translate(-10px,20px) scale(0.95)' },
        },
      },
      animation: {
        'fade-up': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'fade-up-1': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        'fade-up-2': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.2s both',
        'fade-up-3': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.35s both',
        'fade-up-4': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.5s both',
        'fade-left': 'fadeInLeft 0.65s cubic-bezier(0.22,1,0.36,1) both',
        'fade-right': 'fadeInRight 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both',
        'fade-in': 'fadeIn 0.5s ease both',
        'scale-in': 'scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in-1': 'scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        'scale-in-2': 'scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.2s both',
        'scale-in-3': 'scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both',
        'slide-down': 'slideDown 0.4s ease both',
        float: 'float 4s ease-in-out infinite',
        'float-reverse': 'floatReverse 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        shimmer: 'shimmer 2s infinite',
        blob: 'blobMove 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
