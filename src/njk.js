'use strict'

const path = require('path')
const njk  = require('nunjucks')

/*
 * Transform Nunjucks to HTML.
 * @public
 * @param {?String} filePath - Path to the Nunjucks file being rendered.
 * @param {?Object} data - Nunjucks data used to render the file.
 */
module.exports = function(filePath, data) {

	return new Promise((resolve, reject) => {

		// Get the directory of filePath
		const dirPath = path.dirname(filePath)

		// Configure Nunjucks
		njk.configure(dirPath)

		// Render Nunjucks
		const result = njk.render(filePath, data, (err, str) => {

			if (err!=null) return reject(err)

			resolve(str)

		})

	})

}