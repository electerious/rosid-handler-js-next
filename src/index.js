'use strict'

const rollup = require('./rollup.js')

/**
 * Load, transform, bundle and compress JS.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} options - Options.
 * @returns {Promise<String>} JS.
 */
// eslint-disable-next-line require-await
module.exports = async function(filePath, options = {}) {

	if (typeof filePath !== 'string') throw new Error(`'filePath' must be a string`)
	if (typeof options !== 'object') throw new Error(`'options' must be undefined or an object`)

	options = Object.assign({
		optimize: false
	}, options)

	return rollup(filePath, options)

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} options - Options.
 * @returns {String} File extension.
 */
module.exports.in = function(options) {

	return (options != null && options.in != null) ? options.in : '.js'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} options - Options.
 * @returns {String} File extension.
 */
module.exports.out = function(options) {

	return (options != null && options.out != null) ? options.out : '.js'

}

/**
 * Attach an array to the function, which contains a list of
 * file patterns used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'**/*.js',
	'**/*.json'
]