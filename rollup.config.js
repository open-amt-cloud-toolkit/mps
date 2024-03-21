import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
export default {
    input: 'src/index.ts', // Entry point of your application
    output: {
        file: 'dist/bundle.js', // Output bundle file
        format: 'cjs' // Emit as ES module
    },
    plugins: [
        resolve(), // Resolve modules from 'node_modules'
        commonjs(), // Convert CommonJS modules to ES6
        json(),
        typescript(), // Compile TypeScript files
        terser() // Minify the output (optional)
    ]
};
