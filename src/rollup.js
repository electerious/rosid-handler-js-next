const rollup = require('rollup')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const terser = require('@rollup/plugin-terser')
const nodeGlobals = require('rollup-plugin-node-globals')

/**
 * Transform and bundle JS.
 *
 * @public
 * @param {string} filePath - Path to the JS file.
 * @param {object} options - Options for the task.
 * @returns {Promise<string>} Transformed and bundled JS.
 */
module.exports = async function (filePath, options) {
  options = {
    replace: {},
    babel: {},
    rollupInput: {},
    rollupOutput: {},
    nodeGlobals: false,
    ...options,
  }

  const replaceOptions =
    options.optimize === true
      ? {
          'preventAssignment': true,
          'process.env.NODE_ENV': JSON.stringify('production'),
          ...options.replace,
        }
      : {
          preventAssignment: true,
          ...options.replace,
        }

  const babelOptions = {
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env', '@babel/preset-react'],
    compact: false,
    babelrc: false,
    ...options.babel,
  }

  const rollupInputOptions = {
    input: filePath,
    plugins: [
      json(),
      commonjs(),
      nodeResolve({ browser: true }),
      replace(replaceOptions),
      options.nodeGlobals === false ? undefined : nodeGlobals(),
      options.babel === false ? undefined : babel(babelOptions),
    ].filter(Boolean),
    ...options.rollupInput,
  }

  const rollupOutputOptions = {
    format: 'iife',
    plugins: options.optimize === true ? [terser()] : undefined,
    sourcemap: options.optimize === true ? false : 'inline',
    ...options.rollupOutput,
  }

  const bundle = await rollup.rollup(rollupInputOptions)
  const { output } = await bundle.generate(rollupOutputOptions)
  await bundle.close()

  const { code, map: sourcemap } = output[0]
  const hasSourcemap = sourcemap != null

  if (hasSourcemap === true) {
    return `${code}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(sourcemap.toString()).toString('base64')}`
  }

  return code
}
