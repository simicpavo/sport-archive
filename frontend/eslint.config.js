// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: ['.angular/**', 'dist/**', 'node_modules/**', 'src/server.ts'],
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'curly': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-else-return': 'warn',
      'no-multi-spaces': 'error',
      // TODO: Change this rule to official one in the future
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Decorator[expression.callee.name="Input"]',
          message:
            'Consider using signal inputs (input()) instead of @Input() decorator for better performance and type safety.',
        },
        {
          selector: 'Decorator[expression.callee.name="Output"]',
          message:
            'Consider using signal outputs (output()) instead of @Output() decorator for better performance and type safety.',
        },
      ],
      'linebreak-style': ['error', 'windows'],
      'prettier/prettier': ['error', { endOfLine: 'crlf' }], // Enforce Prettier formatting as lint errors
      '@typescript-eslint/no-explicit-any': 'error', // Forbid usage of 'any'
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/attributes-order': [
        'warn',
        {
          alphabetical: true,
          order: [
            'STRUCTURAL_DIRECTIVE', // deprecated, use @if and @for instead
            'TEMPLATE_REFERENCE', // e.g. <input #inputRef>
            'ATTRIBUTE_BINDING', // e.g. <input required>, id="3"
            'INPUT_BINDING', // e.g. [id]="3", [attr.colspan]="colspan",
            'TWO_WAY_BINDING', // e.g. [(id)]="id",
            'OUTPUT_BINDING', // e.g. (idChange)="handleChange()",
          ],
        },
      ],
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 15 }],
    },
  },
);
