'use strict'

const assert = require('chai').assert
const uuid = require('uuid').v4
const rollup = require('../src/rollup')

const fsify = require('fsify')({
	cwd: __dirname,
	persistent: false
})

describe('rollup()', function() {

	it('should return an error when called with a fictive filePath', async function() {

		return rollup('test.js', {}).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return JS when called with a valid JS file', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, {})

		assert.isString(result)

	})

	it('should return untranspiled JS when called with a valid JS file and custom babel options', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'window.fn = () => true'
			}
		])

		const babel = { presets: [] }
		const result = await rollup(structure[0].name, { babel })

		assert.include(result, structure[0].contents)

	})

	it('should return JS without source maps when called with a valid JS file and custom rollup options', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'const fn = () => true'
			}
		])

		const rollupOutput = { sourcemap: false }
		const result = await rollup(structure[0].name, { rollupOutput })

		assert.notInclude(result, 'sourceMappingURL')

	})

	it('should return JS and replace process.env.NODE_ENV when optimize is true', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, { optimize: true })

		assert.include(result, 'production')

	})

	it('should return JS and not replace process.env.NODE_ENV when optimize is false', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'window.fn = () => process.env.NODE_ENV'
			}
		])

		const result = await rollup(structure[0].name, { optimize: false })

		assert.include(result, 'process.env.NODE_ENV')

	})

	it('should return JS and replace process.env.TEST when called with a custom replace object', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: 'window.fn = () => process.env.TEST'
			}
		])

		const replace = { 'process.env.TEST': JSON.stringify(uuid()) }
		const result = await rollup(structure[0].name, { replace })

		assert.include(result, replace['process.env.TEST'])

	})

	it('should return an error when called with an invalid JS file', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: '='
			}
		])

		return rollup(structure[0].name, {}).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

})