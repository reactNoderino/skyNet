/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
