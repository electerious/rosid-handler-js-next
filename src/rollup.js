'use strict'

const rollup = require('rollup')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const nodeGlobals = require('rollup-plugin-node-globals')

/**
 * Transform and bundle JS.
 * @public
 * @param {String} filePath - Path to the JS file.
 * @param {Object} opts - Options for the task.
 * @returns {Promise<String>} Transformed and bundled JS.
 */
module.exports = async function(filePath, opts) {

	opts = {
		replace: {},
		babel: {},
		rollupInput: {},
		rollupOutput: {},
		nodeGlobals: false,
		...opts
	}

	const replaceOpts = opts.optimize === true ? {
		'preventAssignment': true,
		'process.env.NODE_ENV': JSON.stringify('production'),
		...opts.replace
	} : {
		preventAssignment: true,
		...opts.replace
	}

	const babelOpts = {
		babelHelpers: 'bundled',
		presets: [ '@babel/preset-env', '@babel/preset-react' ],
		compact: false,
		babelrc: false,
		...opts.babel
	}

	const rollupInputOpts = {
		input: filePath,
		plugins: [
			json(),
			commonjs(),
			nodeResolve({ browser: true }),
			replace(replaceOpts),
			opts.nodeGlobals !== false ? nodeGlobals() : undefined,
			opts.babel !== false ? babel(babelOpts) : undefined
		].filter(Boolean),
		...opts.rollupInput
	}

	const rollupOutputOpts = {
		format: 'iife',
		plugins: opts.optimize === true ? [ terser() ] : undefined,
		sourcemap: opts.optimize === true ? false : 'inline',
		...opts.rollupOutput
	}

	const bundle = await rollup.rollup(rollupInputOpts)
	const { output } = await bundle.generate(rollupOutputOpts)
	await bundle.close()

	const { code, map: sourcemap } = output[0]
	const hasSourcemap = sourcemap != null

	if (hasSourcemap === true) {
		return `${ code }\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,${ Buffer.from(sourcemap.toString()).toString('base64') }`
	}

	return code

}