const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const index = require('./../src/index.js')

// Files must be in cwd so babel can load the plugins and presents
const fsify = require('fsify').default({
  persistent: false,
})

describe('index()', () => {
  test('should return an error when called without a filePath', async () => {
    await assert.rejects(index(), { message: `'filePath' must be a string` })
  })

  test('should return an error when called with invalid options', async () => {
    const structure = await fsify([
      {
        type: 'file',
        name: `${randomUUID()}.js`,
        contents: 'window.fn = () => true',
      },
    ])

    await assert.rejects(index(structure[0].name, ''), { message: `'options' must be undefined or an object` })
  })

  test('should return an error when called with a fictive filePath', async () => {
    await assert.rejects(index(`${randomUUID()}.js`))
  })

  test('should return an error when called with an invalid JS file', async () => {
    const structure = await fsify([
      {
        type: 'file',
        name: `${randomUUID()}.js`,
        contents: '=',
      },
    ])

    await assert.rejects(index(structure[0].name))
  })

  test('should load JS and transform it to JS', async () => {
    const structure = await fsify([
      {
        type: 'file',
        name: `${randomUUID()}.js`,
        contents: 'window.fn = () => true',
      },
    ])

    const result = await index(structure[0].name)

    assert.equal(typeof result, 'string')
  })

  test('should load JS and transform it to optimized JS when optimization enabled', async () => {
    const structure = await fsify([
      {
        type: 'file',
        name: `${randomUUID()}.js`,
        contents: 'window.fn = () => true',
      },
    ])

    const result = await index(structure[0].name, { optimize: true })

    assert.equal(typeof result, 'string')
  })

  describe('.in()', () => {
    test('should be a function', () => {
      assert.equal(typeof index.in, 'function')
    })

    test('should return a default extension', () => {
      assert.equal(index.in(), '.js')
    })

    test('should return a default extension when called with invalid options', () => {
      assert.equal(index.in(''), '.js')
    })

    test('should return a custom extension when called with options', () => {
      assert.equal(index.in({ in: '.jsx' }), '.jsx')
    })
  })

  describe('.out()', () => {
    test('should be a function', () => {
      assert.equal(typeof index.in, 'function')
    })

    test('should return a default extension', () => {
      assert.equal(index.out(), '.js')
    })

    test('should return a default extension when called with invalid options', () => {
      assert.equal(index.out(''), '.js')
    })

    test('should return a custom extension when called with options', () => {
      assert.equal(index.out({ out: '.jsx' }), '.jsx')
    })
  })

  describe('.cache', () => {
    test('should be an array', () => {
      assert.ok(Array.isArray(index.cache))
    })
  })
})
