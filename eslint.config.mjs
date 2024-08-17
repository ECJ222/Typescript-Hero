import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import eslintConfigPrettier from "eslint-config-prettier";

pluginReactConfig.rules['react/react-in-jsx-scope'] = 'off'
tseslint.configs.recommended.forEach((config) => {
  if (config.rules) {
    config.rules['@typescript-eslint/no-unused-expressions'] = 'off';
  }
})

export default [
  { 
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { 
      globals: { 
        ...globals.browser 
      } 
    } 
  },
  ...tseslint.configs.recommended,
  pluginReactConfig,
  eslintConfigPrettier,
  {
    ignores: ['node_modules/', 'dist/'],
  }
];


