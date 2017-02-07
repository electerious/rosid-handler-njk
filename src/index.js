'use strict'

const findUp = require('find-up')
const njk    = require('./njk')
const data   = require('./data')

/*
 * Load Nunjucks and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath, opts) {

	return Promise.resolve().then(() => {

		if (typeof filePath!=='string')           throw new Error(`'filePath' must be a string`)
		if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	}).then(() => {

		// Find the data.json file by walking up parent directories
		return findUp('data.json')

	}).then((dataPath) => {

		// Get the data for Nunjucks
		return data(dataPath, filePath, opts)

	}).then((data) => {

		// Process file
		return njk(filePath, data)

	}).then((str) => {

		return str

	})

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : 'njk'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : 'html'

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'.njk',
	'.json'
]