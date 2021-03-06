# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [8.0.0] - 2020-03-20

### Changed

- Updated dependencies
- Only support Node.js 10+
- Test with Node.js 10 and 12

## [7.3.0] - 2019-08-21

### New

- `shy` option to overwrite the default pattern of the shy filter

## [7.2.0] - 2019-01-09

### New

- `localOverwrites` option

## [7.1.0] - 2018-12-20

### New

- Support for several kinds of data files using [require-data](https://github.com/electerious/require-data)
- Support for data files returning a function
- Support for data files returning an async function

## [7.0.0] - 2018-08-25

### Changed

- Removed `prepublish` script from `package.json`
- Only support Node.js 8+

## [6.0.0] - 2017-11-20

### Changed

- Auto escaping is now turned on by default

## [5.0.5] - 2017-10-20

### Fixed

- Shy filter on undefined variables

## [5.0.4] - 2017-10-14

### Fixed

- Caching of JS files

## [5.0.3] - 2017-10-03

### Changed

- Improved JSDoc annotation

### Fixed

- Assert parameter order in tests
- Don't cache JS and JSON files

## [5.0.2] - 2017-08-08

### Changed

- Ignore `yarn.lock` and `package-lock.json` files

## [5.0.1] - 2017-07-23

### Changed

- Refactored data location lookup

## [5.0.0] - 2017-07-19

### Added

- Only support Node.js 7 and 8
- Shy filter for Nunjucks

### Changed

- Cache array contains glob patterns for Rosid 8.0