# rosid-handler-js-next

[![Test](https://github.com/electerious/rosid-handler-js-next/actions/workflows/test.yml/badge.svg)](https://github.com/electerious/rosid-handler-js-next/actions/workflows/test.yml)

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

- `filePath` `{string}` Absolute path to file.
- `options` `{?object}` Options.
  - `optimize` `{?boolean}` - Optimize output. Defaults to `false`.
  - `replace` `{?object}` - Variables for [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace). Defaults to an object with `process.env.NODE_ENV` set to `production` when `optimize` is enabled.
  - `babel` `{?object}` - Variables for [@rollup/plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel). Defaults to an object with the presets [env](http://babeljs.io/docs/plugins/preset-env/) and [react](http://babeljs.io/docs/plugins/preset-react/).
  - `nodeGlobals` `{?boolean}` - Enable to disable [rollup-plugin-node-globals](https://github.com/calvinmetcalf/rollup-plugin-node-globals). Defaults to `false`.
  - `rollupInput` `{?object}` - Input variables for rollup.js.
  - `rollupOutput` `{?object}` - Output variables for rollup.js.

## Returns

- `{Promise<string>}` The transformed file content.
