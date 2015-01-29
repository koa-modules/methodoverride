# koa-methodoverride

> HTTP method override middleware for koa.

Forked from [Express method-override][]


[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### Install

```
npm install koa-methodoverride
```

### Usage, more [Express method-override][]

```js
var app = require('koa')();
var methodOverride = require('koa-methodoverride');

app.use(methodOverride());

app.listen(3000);
```


### License

MIT


[Express method-override]: https://github.com/expressjs/method-override


[npm-img]: https://img.shields.io/npm/v/koa-methodoverride.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-methodoverride
[travis-img]: https://img.shields.io/travis/koa-modules/methodoverride.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/methodoverride
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/methodoverride.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/methodoverride?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/methodoverride.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/methodoverride
