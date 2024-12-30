/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background colors
        dark: {
          DEFAULT: '#121826', // Main background (15:1 contrast with white)
          lighter: '#1A2235', // Secondary background
          card: '#1E2638',    // Surface/card background
          hover: '#242D42',   // Hover states
        },
        // Text colors for dark mode
        text: {
          dark: {
            primary: '#F2F5F9',    // Primary text (16:1 contrast)
            secondary: '#B4BCD0',  // Secondary text (8:1 contrast)
            muted: '#8896B2',      // Muted text (5:1 contrast)
          }
        },
        // Border and accent colors
        border: {
          dark: {
            DEFAULT: '#2A3548',   // Default borders
            hover: '#364155',     // Border hover states
          }
        },
        accent: {
          primary: {
            DEFAULT: '#E11D48',   // Primary accent (red)
            hover: '#BE123C',     // Hover state
            muted: '#FDA4AF',     // Muted variant
          },
          secondary: {
            DEFAULT: '#3B82F6',   // Secondary accent (blue)
            hover: '#2563EB',     // Hover state
            muted: '#93C5FD',     // Muted variant
          }
        },
      },
      // Custom opacity values for overlays
      opacity: {
        '85': '0.85',
        '95': '0.95',
      },
    }
  },
  plugins: [],
};
