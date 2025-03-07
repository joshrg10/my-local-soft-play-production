/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add custom colors
      colors: {
        'pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
      },
      // Optimize typography
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            h1: {
              color: '#1f2937',
              fontWeight: '700',
            },
            h2: {
              color: '#1f2937',
              fontWeight: '700',
            },
            h3: {
              color: '#1f2937',
              fontWeight: '600',
            },
            strong: {
              color: '#1f2937',
              fontWeight: '600',
            },
            a: {
              color: '#ec4899',
              '&:hover': {
                color: '#db2777',
              },
            },
            ul: {
              li: {
                '&::marker': {
                  color: '#ec4899',
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: '#ec4899',
                },
              },
            },
          },
        },
      },
      // Add animation variants
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
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
    require('@tailwindcss/typography'),
  ],
  // Optimize for production
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    relativeContentPathsByDefault: true,
  },
  // Optimize variants
  variants: {
    extend: {
      opacity: ['group-hover'],
      scale: ['group-hover'],
      translate: ['group-hover'],
    },
  },
}