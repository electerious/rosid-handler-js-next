# rosid-handler-js-next

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-js-next.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-js-next) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-js-next/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-js-next?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-js-next.svg)](https://david-dm.org/electerious/rosid-handler-js-next#info=dependencies)

A function that loads a JS file and transforms, bundles and compresses its content.

## Install

```
npm install rosid-handler-js-next
```

## Usage

### API

```js
const handler = require('rosid-handler-js-next')

handler('main.js').then((data) => {})
handler('main.js', { optimize: true }).then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid/blob/master/docs/Routes.md). `rosid-handler-js-next` will transform, bundles and compresses all matching JS files in your source folder.

```json
{
  "name": "JS",
  "path": "[^_]*.js",
  "handler": "rosid-handler-js-next"
}
```

```js
// main.js
export default () => 'Hello World'
```

```js
// main.js (output)
'use strict'
;(Object.defineProperty(exports, '__esModule', { value: !0 }),
  (exports['default'] = function () {
    return 'Hello World'
  }))
```

## Parameters

- `filePath` `{String}` Absolute path to file.
- `options` `{?Object}` Options.
  - `optimize` `{?Boolean}` - Optimize output. Defaults to `false`.
  - `replace` `{?Object}` - Variables for [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace). Defaults to an object with `process.env.NODE_ENV` set to `production` when `optimize` is enabled.
  - `babel` `{?Object}` - Variables for [@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel). Defaults to an object with the presets [env](http://babeljs.io/docs/plugins/preset-env/) and [react](http://babeljs.io/docs/plugins/preset-react/).
  - `nodeGlobals` `{?Boolean}` - Enable to disable [rollup-plugin-node-globals](https://github.com/calvinmetcalf/rollup-plugin-node-globals). Defaults to `false`.
  - `rollupInput` `{?Object}` - Input variables for rollup.js.
  - `rollupOutput` `{?Object}` - Output variables for rollup.js.

## Returns

- `{Promise<String|Buffer>}` The transformed file content.
