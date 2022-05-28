import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: "./build/editor.js",
  output: {
    file: "./build/editor.bundle.js",
    format: "cjs"
  },
  plugins: [nodeResolve(), commonjs()]
}