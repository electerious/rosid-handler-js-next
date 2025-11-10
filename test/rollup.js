'use strict'

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const {randomUUID} = require('node:crypto')
const rollup = require('../src/rollup.js')

const fsify = require('fsify').default({
	cwd: __dirname,
	persistent: false
})

describe('rollup()', () => {

	test('should return an error when called with a fictive filePath', async () => {

		await assert.rejects(rollup('test.js', {}))

	})

	test('should return JS when called with a valid JS file', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, {})

		assert.strictEqual(typeof result, 'string')

	})

	test('should return untranspiled JS when called with a valid JS file and custom babel options', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => true'
			}
		])

		const babel = { presets: [] }
		const result = await rollup(structure[0].name, { babel })

		assert.ok(result.includes(structure[0].contents))

	})

	test('should return JS without source maps when called with a valid JS file and custom rollup options', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => true'
			}
		])

		const rollupOutput = { sourcemap: false }
		const result = await rollup(structure[0].name, { rollupOutput })

		assert.ok(!result.includes('sourceMappingURL'))

	})

	test('should return JS and replace process.env.NODE_ENV when optimize is true', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, { optimize: true })

		assert.ok(result.includes('production'))

	})

	test('should return JS and not replace process.env.NODE_ENV when optimize is false', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, { optimize: false })

		assert.ok(result.includes('process.env.NODE_ENV'))

	})

	test('should return JS and replace process.env.TEST when called with a custom replace object', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: 'window.fn = () => process.env.TEST'
			}
		])

		const replace = { 'process.env.TEST': JSON.stringify(randomUUID()) }
		const result = await rollup(structure[0].name, { replace })

		assert.ok(result.includes(replace['process.env.TEST']))

	})

	test('should return an error when called with an invalid JS file', async () => {

		const structure = await fsify([
			{
				type: 'file',
				name: `${randomUUID()}.js`,
				contents: '='
			}
		])

		await assert.rejects(rollup(structure[0].name, {}))

	})

})