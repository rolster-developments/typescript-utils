import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  resolve(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: 'dist',
    include: ['node_modules/@rolster/typescript-types/index.d.ts']
  })
];

export default [
  {
    plugins,
    input: ['dist/esm/index.js'],
    output: [
      {
        file: 'dist/es/index.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ]
  },
  {
    plugins,
    input: ['dist/esm/constants.js'],
    output: [
      {
        file: 'dist/es/constants.js',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: 'dist/cjs/constants.js',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ]
  }
];
