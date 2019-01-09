# rosid-handler-njk

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-njk.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-njk) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-njk/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-njk?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-njk.svg)](https://david-dm.org/electerious/rosid-handler-njk#info=dependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/electerious/rosid-handler-njk.svg)](https://greenkeeper.io/)

A function that loads a Nunjucks template and transforms it to HTML.

## Install

```
npm install rosid-handler-njk
```

## Usage

### API

```js
const handler = require('rosid-handler-njk')

handler('index.njk').then((data) => {})
handler('index.njk', { optimize: true }).then((data) => {})
handler('index.njk', { data: { key: 'value' } }).then((data) => {})
handler('index.njk', { data: 'data.json' }).then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid/blob/master/docs/Routes.md). `rosid-handler-njk` will transform all matching Nunjucks files in your source folder to HTML.

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

- `filePath` `{String}` Path to file.
- `opts` `{?Object}` Options.
	- `optimize` `{?Boolean}` - Optimize output. Defaults to `false`.
	- `data` `{?Object|String}` - Data used to render the template. Defaults to `{}`.
	- `localOverwrites` `{?Boolean}` - Enable or disable [custom data per file](#custom-data-per-file). Defaults to `true`.
	- `prepend` `{?String}` - String that will be placed in front of the content of filePath. Defaults to `''`.
	- `append` `{?String}` - String that will be placed at the end of the content of filePath. Defaults to `''`.
	- `src` `{?String}` - Path base for injects with the inject tag. Defaults to the current working directory.

## Returns

- `{Promise<String|Buffer>}` The transformed file content.

## Miscellaneous

### Inject tag

`rosid-handler-njk` adds a custom Nunjucks extension you can use in your templates. The Nunjucks tag `inject` allows you to include other Nunjucks files with custom data. This feature is currently not part of Nunjucks.

```html
{% inject 'button.njk' %}
{% inject 'button.njk', { color: 'purple', text: 'Button' } %}
```

The path to the file is always relative to the current working directory or to the path specified in `opts.src`. This behavior is different to Nunjucks's build-in `include` tag, where the path is relative to the initial file.

```html
<!-- src/index.njk -->
{% inject 'src/includes/a.njk' %}
{% include 'includes/a.njk' %}

<!-- src/includes/a.njk -->
{% inject 'src/includes/b.njk' %}
{% include 'includes/b.njk' %}

<!-- src/includes/b.njk -->
{{ 'This is a file' }}
```

### Shy filter

`rosid-handler-njk` adds a custom filter that replaces `|` with `&shy;` and indicates that the string should not be auto escaped by Nunjucks (similar to the `safe` filter).

```html
{{ 'Long head|lines are awe|some' | shy }}
```

### Data

The data in `opts.data` will be used to render your template. `opts.data` can either be an object (the data) or a string (path to data file). `rosid-handler-njk` tries to require the path when a string is specified instead of an object. The path must be absolute or relative to the current working directory.

### Custom data per file

Create a file with the name `filename.data.json` or `filename.data.js` along your `filename.njk` to add or overwrite data from `opts.data`. You can disable this behaviour with the `localOverwrites` option.

### Environment

`rosid-handler-njk` passes a variable called `environment` to your template. `environment` is `prod` when `opts.optimize` is `true` and `dev` when `opts.optimize` is `false`.