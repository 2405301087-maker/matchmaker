/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        error: "#ba1a1a",
        outline: "#777587",
        "surface-container-highest": "#dfe1f9",
        "tertiary-container": "#006e4b",
        "outline-variant": "#c7c4d8",
        "error-container": "#ffdad6",
        "primary-fixed": "#e2dfff",
        "on-surface-variant": "#464555",
        "on-surface": "#181a2c",
        secondary: "#006591",
        "surface-container": "#ececff",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#6ffbbe",
        "inverse-surface": "#2c2f41",
        "on-error": "#ffffff",
        tertiary: "#005338",
        "on-tertiary-fixed": "#002113",
        background: "#fbf8ff",
        "primary-fixed-dim": "#c3c0ff",
        "on-primary-fixed-variant": "#3323cc",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed-variant": "#005236",
        "on-primary-fixed": "#0f0069",
        "inverse-on-surface": "#f0efff",
        "surface-dim": "#d7d8f0",
        "on-secondary": "#ffffff",
        "primary-container": "#4f46e5",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "secondary-container": "#39b8fd",
        surface: "#fbf8ff",
        "surface-container-low": "#f4f2ff",
        primary: "#3525cd",
        "secondary-fixed": "#c9e6ff",
        "on-error-container": "#93000a",
        "on-secondary-fixed-variant": "#004c6e",
        "surface-variant": "#dfe1f9",
        "on-background": "#181a2c",
        "surface-container-high": "#e5e6ff",
        "on-primary": "#ffffff",
        "surface-bright": "#fbf8ff",
        "on-secondary-fixed": "#001e2f",
        "secondary-fixed-dim": "#89ceff",
        "on-secondary-container": "#004666",
        "surface-tint": "#4d44e3",
        "on-tertiary-container": "#67f4b7",
        "inverse-primary": "#c3c0ff"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        "gutter-sm": "1rem",
        "margin-sm": "1rem",
        gutter: "1.5rem",
        "space-xl": "2.5rem",
        "space-lg": "1.5rem",
        margin: "2rem",
        "space-xs": "0.25rem",
        "space-md": "1rem",
        "space-sm": "0.5rem"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  },
  plugins: []
}
