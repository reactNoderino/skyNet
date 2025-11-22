/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      mobile: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        priority: {
          low: "#E09CB5",
          medium: "#F4C67C",
          high: "#EA3587",
          none: "#8FA3D1",
        },
        background: "#161616",
        surface: "#1F1F1F",
        border: "#2B2B2B",
        text: {
          primary: "#FFFFFF",
          secondary: "#A8A8A8",
        },
      },
      spacing: {
        4.5: "1.125rem",
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
