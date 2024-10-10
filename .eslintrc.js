
module.exports = {
    root: true,
    // 扩展规则
    extends:[
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    parseOptions:{
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    rules:{
        'no-var': 'error',
        'no-undef': 0,
        '@typescript-eslint/consistent-type-definitions':[
            'error',
            'interface'
        ],
    },
}