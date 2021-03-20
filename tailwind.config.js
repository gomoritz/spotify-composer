const colors = require("tailwindcss/colors")

module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: "class",
    theme: {
        colors: {
            ...colors
        }
    },
    variants: {
        extend: {
            scale: ["group-hover"]
        }
    },
    plugins: []
}
