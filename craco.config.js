const CracoAlias = require("craco-alias")
const CracoEsbuild = require("craco-esbuild")

module.exports = {
    style: {
        postcss: {
            plugins: [
                require("tailwindcss"),
                require("autoprefixer")
            ]
        }
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: "./src",
                tsConfigPath: "./tsconfig.extend.json"
            }
        },
        { plugin: CracoEsbuild }
    ]
}
