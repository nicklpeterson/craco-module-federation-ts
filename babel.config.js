module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        ["module-resolver", {
            "alias": {
                "extensions": [".tsx",".ts"],
            }
        }]
    ],
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        ['@babel/preset-typescript', { allExtensions: true }],
    ],
    compact: false,
    sourceType: 'unambiguous',
};