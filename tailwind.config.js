/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/module/**/*.{js,ts,jsx,tsx,mdx}',
    './src/@emran/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },

      backgroundImage: {
        'gradient-radial-dark':
          'radial-gradient(ellipse at center, #0f0f0f, #1a1a1a)',
        'gradient-radial-cyan':
          'radial-gradient(ellipse at center, #00141c, #1a1a1a)',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
  plugins: [],
};
