/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' assert { type: 'json' };
/**
* Comment with library information to be appended in the generated bundles.
*/
const banner = `/**
* ${pkg.name} ${pkg.version}
* (c) ${pkg.author.name} ${pkg.author.email}
* Released under the ${pkg.license} License.
*/
`.trim();
/**
* @type {import('rollup').RollupOptions}
*/
const options =
{
    input: 'src/index.ts',
    output: [
        {
            banner,
            file: './dist/umd/index.js',
            format: 'umd',
            sourcemap: true,
            name: "NEWTON",
        },
        {
            banner,
            file: './dist/umd/index.min.js',
            format: 'umd',
            sourcemap: true,
            name: "NEWTON",
            plugins: [terser()]
        },
        {
            banner,
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            name: 'NEWTON'
        },
        {
            banner,
            file: './dist/esm/index.js',
            format: 'esm',
            sourcemap: true
        },
        {
            banner,
            file: './dist/esm/index.min.js',
            format: 'esm',
            sourcemap: true,
            plugins: [terser()]
        },
        {
            banner,
            file: './dist/system/index.js',
            format: 'system',
            sourcemap: true
        },
        {
            banner,
            file: './dist/system/index.min.js',
            format: 'system',
            sourcemap: true,
            plugins: [terser()]
        }
    ],
    plugins: [
        external(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' })
    ]
};
export default [
    options,
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: pkg.types, format: "esm" }],
        plugins: [dts()],
    }
];