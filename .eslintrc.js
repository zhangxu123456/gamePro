module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  'rules': {
		'prefer-const': 'off',
    'indent': 'off',
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'eol-last': 'off',
    'space-in-parens': 'off',
    'operator-linebreak': 'off',
    'no-trailing-spaces': 'off',
    'quote-props': 'off',
    'comma-dangle': 'off',
    'standard/no-callback-literal': 'off',
    'no-unused-vars': 'off',
    'no-unreachable': 'warn',
    'no-useless-constructor': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
