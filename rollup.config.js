import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import del from 'rollup-plugin-delete';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json';

export default {
    input: 'src/scrollspy.js',
    output: [
        {
            file: 'dist/scrollspy.cjs.js',
            format: 'cjs',
            exports: 'default'
        },
        {
            file: 'dist/scrollspy.esm.js',
            format: 'esm',
        },
        {
            file: 'dist/scrollspy.js',
            format: 'umd',
            name: 'ScrollSpy'
        }
    ],
    plugins: [
        del({ targets: 'dist/*' }),
        filesize(),
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        minify({
            removeConsole: true,
            removeDebugger: true,
            comments: false
        })
    ]
};