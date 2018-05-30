# koa-methodoverride

> HTTP method override middleware for koa.

Forked from [Express method-override][]


[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![Dependency status][david-img]][david-url]
[![License][license-img]][license-url]

### Install

```
npm install koa-methodoverride
```

* note: `koa-methodoverride@2.x` is for `koa@2.x`, use `koa-methodoverride@1.x` with `koa@1.x`.

### Usage, more [Express method-override][]

```js
var app = require('koa')();
var methodOverride = require('koa-methodoverride');

app.use(methodOverride('_method'));

app.listen(3000);
```

This package leverages [async-busboy](https://github.com/m4nuC/async-busboy) for `multipart/formdata` enctype.  
For those who want to read files and fields in this case, a new helper method `ctx.req.getAsyncBusboyBody()` is exposed.
Thus, instead of
```js
const { files, fields } = await asyncBusboy(ctx.req);
```
, you need to use
```js
const { files, fields } = await ctx.req.getAsyncBusboyBody();
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
[downloads-image]: https://img.shields.io/npm/dm/koa-methodoverride.svg?style=flat-square
