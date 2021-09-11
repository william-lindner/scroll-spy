import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';
import del from 'rollup-plugin-delete';
import { terser } from "rollup-plugin-terser";

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
            file: 'public/scrollspy.js',
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
        terser({
            compress: {
                drop_console: true,
                drop_debugger: true,
                dead_code: true
            },
            mangle: true,
            keep_classnames: false,
        })
    ]
};