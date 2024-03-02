/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.{js,ts}", "./src/**/*.{js,ts}"],
  theme: {
    extend: {},
    colors: {
      baseColor: "#000835",
      pillColor: "#6153cc22",
      forecastColor: "#6153cc2d",
      popupColor: "#6153cc",
      popupForecastCardColor: "#252866",
    },
    textColor: {
      white: "#fff",
      pill: "#b8b8b8",
    }
  },
  plugins: [],
}

