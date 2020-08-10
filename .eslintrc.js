module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/essential",
        "@vue/standard"
    ],
    "parserOptions": {
        "parser": "babel-eslint"
    },
    "rules": {
        "indent": [
            2,
            2,
            {
                "SwitchCase": 1
            }
        ],
        "space-before-function-paren": 0
    }
}
