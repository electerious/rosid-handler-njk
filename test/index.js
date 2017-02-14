'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

const newFile = function(content, suffix, dir) {

	const file = temp.openSync({ suffix, dir })

	fs.writeFileSync(file.path, content)

	return file.path

}

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

		const file = newFile('', '.njk')

		return index(file, '').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

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

		const file = newFile('{{ + }}', '.njk')

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load Nunjucks and transform it to HTML', function() {

		const file = newFile('{{ environment }}', '.njk')

		return index(file).then((data) => {

			assert.strictEqual(data, 'dev')

		})

	})

	it('should load Nunjucks and transform it to HTML with custom global data', function() {

		const file = newFile('{{ key }}', '.njk')

		const data = { key: 'value' }

		return index(file, { data }).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	it('should load Nunjucks and transform it to HTML with custom inject tag but without global data', function() {

		const data = { key: 'value' }

		const partial = newFile('{{ key }}{{ environment }}', '.njk')
		const file    = newFile(`{% inject '${ path.relative(path.dirname(partial), partial) }', ${ JSON.stringify(data) } %}`, '.njk', path.dirname(partial))

		return index(file).then((_data) => {

			assert.strictEqual(_data, data.key)

		})

	})

	it('should load Nunjucks and transform it to optimized HTML when optimization enabled', function() {

		const file = newFile('{{ environment }}', '.njk')

		return index(file, { optimize: true }).then((data) => {

			assert.strictEqual(data, 'prod')

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