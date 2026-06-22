import eslint from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import typescript from '@vue/eslint-config-typescript'
import vue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...typescript(),
  prettier,
]
