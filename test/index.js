'use strict'

const os     = require('os')
const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const uuid   = require('uuid/v4')
const index  = require('./../src/index')

const fsify = require('fsify')({
	cwd        : os.tmpdir(),
	persistent : false,
	force      : true
})

describe('index()', function() {

	it('should return an error when called without a filePath', function() {

		return index().then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid options', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name, '')

		}).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`'opts' must be undefined, null or an object`, err.message)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.njk').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid Nunjucks', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: '{{ + }}'
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name)

		}).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load Nunjucks and transform it to HTML', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: '{{ environment }}'
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name)

		}).then((data) => {

			assert.strictEqual(data, 'dev')

		})

	})

	it('should load Nunjucks and transform it to HTML with custom global data', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: '{{ key }}'
			}
		]

		const data = { key: 'value' }

		return fsify(structure).then((structure) => {

			return index(structure[0].name, { data })

		}).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	it('should load Nunjucks and transform it to HTML with custom inject tag but without global data', function() {

		const data = { key: 'value' }

		const filename = `${ uuid() }.njk`

		const structure = [
			{
				type: fsify.FILE,
				name: filename,
				contents: '{{ key }}{{ environment }}'
			},
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: `{% inject '${ filename }', ${ JSON.stringify(data) } %}`
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[1].name)

		}).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	it('should load Nunjucks and transform it to optimized HTML when optimization enabled', function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: '{{ environment }}'
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name, { optimize: true })

		}).then((data) => {

			assert.strictEqual(data, 'prod')

		})

	})

	it('should load Nunjucks and transform it to HTML with a custom prepend', function() {

		const prepend = 'value'

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: ''
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name, { prepend })

		}).then((data) => {

			assert.strictEqual(data, prepend)

		})

	})

	it('should load Nunjucks and transform it to HTML with a custom append', function() {

		const append = 'value'

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.njk`,
				contents: ''
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name, { append })

		}).then((data) => {

			assert.strictEqual(data, append)

		})

	})

	it('should load Nunjucks and transform it to HTML with custom data from a JS data file', function() {

		const data = { key: 'value' }

		const filename = uuid()

		const structure = [
			{
				type: fsify.FILE,
				name: `${ filename }.njk`,
				contents: '{{ key }}'
			},
			{
				type: fsify.FILE,
				name: `${ filename }.data.js`,
				contents: `module.exports = ${ JSON.stringify(data) }`
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name)

		}).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	it('should load Nunjucks and transform it to HTML with custom data from a JSON data file', function() {

		const data = { key: 'value' }

		const filename = uuid()

		const structure = [
			{
				type: fsify.FILE,
				name: `${ filename }.njk`,
				contents: '{{ key }}'
			},
			{
				type: fsify.FILE,
				name: `${ filename }.data.json`,
				contents: JSON.stringify(data)
			}
		]

		return fsify(structure).then((structure) => {

			return index(structure[0].name)

		}).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	describe('.in()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.in(), 'njk')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.in(''), 'njk')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.in({ in: 'xml' }), 'xml')

		})

	})

	describe('.out()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.out(), 'html')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.out(''), 'html')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.out({ out: 'xml' }), 'xml')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})