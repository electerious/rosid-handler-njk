'use strict'

const path            = require('path')
const requireUncached = require('require-uncached')

/**
 * Loads and parses data for Nunjucks.
 * @public
 * @param {String} dataPath - Path to the data JSON.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(dataPath, opts) {

	return new Promise((resolve, reject) => {

		const environment = (opts!=null && opts.optimize===true) ? 'prod' : 'dev'
		const globalData  = (opts!=null && opts.data!=null) ? opts.data : {}
		const localData   = dataPath==null ? {} : requireUncached(dataPath)

		resolve(Object.assign({}, globalData, localData, {
			environment
		}))

	})

}