'use strict'

const njk = require('nunjucks')

/*
 * Transform Nunjucks to HTML.
 * @public
 * @param {?String} filePath - Path to the Nunjucks file being rendered.
 * @param {?Object} data - Nunjucks data used to render the file.
 */
module.exports = function(filePath, data) {

	return new Promise((resolve, reject) => {

		// Configure Nunjucks
		njk.configure(filePath)

		// Render Nunjucks
		const result = njk.render(filePath, data, (err, str) => {

			if (err!=null) return reject(err)

			resolve(str)

		})

	})

}