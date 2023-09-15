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

const createConfiguration = (file) => {
  return {
    input: [`dist/esm/${file}.js`],
    output: [
      {
        file: `dist/cjs/${file}.js`,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: `dist/es/${file}.js`,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    plugins
  };
};

export default [
  createConfiguration('index'),
  createConfiguration('array'),
  createConfiguration('date'),
  createConfiguration('string')
];
