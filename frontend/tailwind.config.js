/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          ink: '#0F172A',
          accent: '#0EA5E9',
          accentDeep: '#0369A1',
          warm: '#F59E0B',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          success: '#10B981',
          error: '#EF4444'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 4px rgba(59, 130, 246, 0.18)'
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.5rem'
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
