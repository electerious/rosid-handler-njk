'use strict'

const path = require('path')
const fs = require('fs')
const njk = require('nunjucks')
const pify = require('pify')

/**
 * Custom tag for Nunjucks. Renders a file with custom data.
 * @param {String} src - Path base for further injects with the inject tag.
 */
const InjectTag = function(src) {

	this.tags = [ 'inject' ]

	this.parse = function(parser, nodes, lexer) {

		const token = parser.nextToken()
		const args = parser.parseSignature(null, true)

		parser.advanceAfterBlockEnd(token.value)

		return new nodes.CallExtensionAsync(this, 'run', args)

	}

	this.run = function(context, filePath, data, next) {

		filePath = path.resolve(src, filePath)

		// Allow usage without data passed to the tag
		if (next==null) {
			next = data
			data = null
		}

		const opts = {
			prepend: '',
			append: '',
			src
		}

		render(filePath, data, opts, (err, str) => {

			if (err!=null) return next(err)

			// Tell Nunjucks that it shouldn't escape the HTML of the component
			str = new njk.runtime.SafeString(str)

			next(null, str)

		})

	}

}

/**
 * Custom filter for Nunjucks. Replaces pipes with shy.
 * @param {?String} target - The target object the filter gets applied on.
 */
const shyFilter = function(target) {

	return target==null ? target : target.replace(/\|/g, '&shy;')

}

/**
 * Creates a new Nunjucks enviroment.
 * @param {String} src - Injects of the inject tag are using this folder as their path base.
 * @returns {Object} New Nunjucks enviroment.
 */
const createEnvironment = function(src) {

	// Nunjucks (by default) uses the current working directory to look for files.
	// Paths in Nunjucks are always relative to the initial file.
	const loader = new njk.FileSystemLoader([ '/' ])

	const env = new njk.Environment(loader)

	env.addExtension('inject', new InjectTag(src))
	env.addFilter('shy', shyFilter)

	return env

}

/**
 * Renders a Nunjucks file with a new enviroment.
 * @param {String} filePath - Path to the Nunjucks file being rendered.
 * @param {Object} data - Nunjucks data used to render the file.
 * @param {Object} opts - Options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err, str.
 */
const render = function(filePath, data, opts, next) {

	const env = createEnvironment(opts.src)

	fs.readFile(filePath, 'utf8', (err, str) => {

		if (err!=null) return next(err)

		str = opts.prepend + str + opts.append

		env.renderString(str, data, {
			path: filePath
		}, next)

	})

}

/**
 * Transforms Nunjucks to HTML.
 * @public
 * @param {?String} filePath - Path to the Nunjucks file being rendered.
 * @param {?Object} data - Nunjucks data used to render the file.
 * @param {?Object} opts - Options.
 * @returns {Promise<String>} HTML.
 */
module.exports = async function(filePath, data, opts) {

	const prepend = (opts!=null && typeof opts.prepend==='string') ? opts.prepend : ''
	const append = (opts!=null && typeof opts.append==='string') ? opts.append : ''
	const src = (opts!=null && typeof opts.src==='string') ? opts.src : process.cwd()

	return pify(render)(filePath, data, {
		prepend,
		append,
		src
	})

}