module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for Rabat Urban Platform
        'rabat-primary': {
          50: '#E6F2F2',
          100: '#B3E0E0',
          200: '#80CCCC',
          300: '#4DBABA',
          400: '#1AA6A6',
          500: '#008080', // Main primary color
          600: '#006666',
          700: '#004D4D',
          800: '#003333',
          900: '#001A1A',
        },
        'rabat-accent': {
          50: '#FFF3E0',
          100: '#FFE0B3',
          200: '#FFCC80',
          300: '#FFB84D',
          400: '#FFA500', // Orange accent
          500: '#E69500',
          600: '#CC8400',
          700: '#B37300',
          800: '#996300',
          900: '#805200',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'rabat-light': '0 4px 6px -1px rgba(0, 128, 128, 0.1), 0 2px 4px -1px rgba(0, 128, 128, 0.06)',
        'rabat-medium': '0 10px 15px -3px rgba(0, 128, 128, 0.15), 0 4px 6px -2px rgba(0, 128, 128, 0.1)',
      },
      borderRadius: {
        'rabat': '0.625rem', // 10px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}