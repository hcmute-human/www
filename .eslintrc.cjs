/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['@typescript-eslint', 'react', 'react-hooks'],
	rules: {
		'@typescript-eslint/no-misused-promises': [
			2,
			{
				checksVoidReturn: {
					attributes: false,
				},
			},
		],
	},
	root: true,
};
