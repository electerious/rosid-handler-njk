'use strict'

const path = require('path')
const njk  = require('nunjucks')
const pify = require('pify')

/*
 * Custom tag for Nunjucks. Renders a file with custom data.
 * @param {String} basePath - Path to the folder of the Nunjucks file being rendered.
 */
const RenderTag = function(basePath) {

	this.tags = [ 'render' ]

	this.parse = function(parser, nodes, lexer) {

		const token = parser.nextToken()
		const args  = parser.parseSignature(null, true)

		parser.advanceAfterBlockEnd(token.value)

		return new nodes.CallExtensionAsync(this, 'run', args)

	}

	this.run = function(context, filePath, data, next) {

		// Convert to absolute path
		filePath = path.join(basePath, filePath)

		render(filePath, data, next)

	}

}

/*
 * Creates a new Nunjucks enviroment.
 * @param {String} filePath - Path to the Nunjucks file being rendered.
 */
const createEnvironment = function(filePath) {

	// Get the directory of filePath
	const basePath = path.dirname(filePath)

	// Configure Nunjucks and ensure that all file includes are based
	// on the folder of the Nunjucks file being rendered.
	const env = new njk.Environment(new njk.FileSystemLoader(basePath), {
		autoescape: false
	})

	env.addExtension('render', new RenderTag(basePath))

	return env

}

/*
 * Renders a Nunjucks file with a new enviroment.
 * @param {String} filePath - Path to the Nunjucks file being rendered.
 * @param {Object} data - Nunjucks data used to render the file.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err, str.
 */
const render = function(filePath, data, next) {

	const env = createEnvironment(filePath)

	return env.render(filePath, data, next)

}

/*
 * Transforms Nunjucks to HTML.
 * @public
 * @param {?String} filePath - Path to the Nunjucks file being rendered.
 * @param {?Object} data - Nunjucks data used to render the file.
 */
module.exports = function(filePath, data) {

	return pify(render)(filePath, data)

}