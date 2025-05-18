/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* خلفيات المود الداكن */
        surface      : "#181818",   // خلفيّة عامّة
        surface2     : "#1f1f1f",   // البطاقة الرماديّة
        border       : "#323232",

        /* الزرّ الأخضر */
        primary      : "#64b263",
        primaryHover : "#54a453",
      },
    },
  },
  plugins: [],
};
