import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: "./build/src/editor.js",
  output: {
    file: "./build/src/editor.bundle.js",
    format: "cjs"
  },
  plugins: [nodeResolve(), commonjs()]
}