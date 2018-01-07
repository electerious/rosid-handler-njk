# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Removed `prepublish` script from `package.json`

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

### New

- Only support Node.js 7 and 8
- Shy filter for Nunjucks

### Changed

- Cache array contains glob patterns for Rosid 8.0