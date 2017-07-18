'use strict'

const path = require('path')
const locatePath = require('locate-path')
const njk = require('./njk')
const data = require('./data')

/**
 * Load Nunjucks and transform to HTML.
 * @public
 * @param {String} filePath - Path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = async function(filePath, opts) {

	if (typeof filePath!=='string') throw new Error(`'filePath' must be a string`)
	if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	const fileDir = path.dirname(filePath)
	const fileName = path.parse(filePath).name

	const dataPath = await (async () => {

		// Look for the data in the same directory as filePath
		const dataPath = await locatePath([
			`${ fileName }.data.js`,
			`${ fileName }.data.json`
		], {
			cwd: fileDir
		})

		// Convert dataPath path to an absolute path
		return dataPath==null ? null : path.join(fileDir, dataPath)

	})()

	const json = await data(dataPath, opts)

	return njk(filePath, json, opts)

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : '.njk'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : '.html'

}

/**
 * Attach an array to the function, which contains a list of
 * file patterns used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'**/*.njk',
	'**/*.data.json',
	'**/*.data.js'
]