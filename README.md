# rosid-handler-njk

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-njk.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-njk) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-njk/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-njk?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-njk.svg)](https://david-dm.org/electerious/rosid-handler-njk#info=dependencies)

A function that loads a Nunjucks template and transforms it to HTML.

## Install

```
npm install rosid-handler-njk
```

## Usage

### API

```js
const njk = require('rosid-handler-njk')

njk('/src/index.njk').then((data) => {})
njk('/src/index.xml').then((data) => {})
njk('/src/index.njk', { optimize: true }).then((data) => {})
njk('/src/index.njk', { data: { key: 'value' } }).then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid#routes). `rosid-handler-njk` will transform all matching Nunjucks files in your source folder to HTML.

```json
{
	"name"    : "NJK",
	"path"    : "[^_]*.{html,njk}*",
	"handler" : "rosid-handler-njk"
}
```

```html
<!-- index.njk -->
<h1>Hello {{ 'World' }}</h1>
```

```html
<!-- index.html (output) -->
<h1>Hello World</h1>
```

## Parameters

- `filePath` `{String}` Absolute path to file.
- `opts` `{?Object}` Options.
	- `optimize` `{?Boolean}` - Optimize output. Defaults to `false`.
	- `data` `{?Object}` - Data uses to render the template. Defaults to `{}`.

## Returns

- `{Promise}({String|Buffer})` The transformed file content.