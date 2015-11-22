const Koa = require('koa')
const request = require('supertest')
const methodOverride = require('..')

describe('methodOverride(getter)', () => {
  it('should not touch the method by default', (done) => {
    var server = createServer()
    request(server)
    .get('/')
    .expect('GET', done)
  })

  it('should use X-HTTP-Method-Override by default', (done) => {
    var server = createServer()
    request(server)
    .post('/')
    .set('X-HTTP-Method-Override', 'DELETE')
    .expect('DELETE', done)
  })

  describe('with query', () => {
    it('should work missing query', (done) => {
      var server = createServer('_method')
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('POST', done)
    })

    it('should be case in-sensitive', (done) => {
      var server = createServer('_method')
      request(server)
      .post('/?_method=DElete')
      .set('Content-Type', 'application/json')
      .expect('DELETE', done);
    })

    it('should handle key referencing array', (done) => {
      var server = createServer('_method')
      var test = request(server).post('/')
      test.request().path += '?_method=DELETE&_method=PUT' // supertest mangles query params
      test.set('Content-Type', 'application/json')
      test.expect('DELETE', done)
    })

    it('should only work with POST', (done) => {
      var server = createServer('_method')

      request(server)
      .delete('/?_method=PATCH')
      .set('Content-Type', 'application/json')
      .expect('DELETE', done)
    })
  })

  describe('with header', () => {
    var server
    before(() => {
      server = createServer('X-HTTP-Method-Override')
    })

    it('should work missing header', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('POST', done)
    })

    it('should be case in-sensitive', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELete')
      .expect('DELETE', done)
    })

    it('should ignore invalid methods', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'BOGUS')
      .expect('POST', done)
    })

    it('should handle multiple headers', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE, PUT')
      .expect('DELETE', done)
    })

    it('should set Vary header', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('Vary', 'X-HTTP-Method-Override')
      .expect('DELETE', done)
    })

    it('should set Vary header even with no override', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('Vary', 'X-HTTP-Method-Override')
      .expect('POST', done)
    })
  })

  describe('with function', () => {
    var server
    before(() => {
      server = createServer((req) => {
        return req.headers['x-method-override'] || 'PaTcH'
      })
    })

    it('should work missing header', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('PATCH', done)
    })

    it('should be case in-sensitive', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-Method-Override', 'DELete')
      .expect('DELETE', done)
    })

    it('should ignore invalid methods', (done) => {
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-Method-Override', 'BOGUS')
      .expect('POST', done)
    })
  })

  describe('given "options.methods"', () => {
    it('should allow other methods', (done) => {
      var server = createServer('X-HTTP-Method-Override', { methods: ['POST', 'PATCH'] })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('DELETE', done)
    })

    it('should allow all methods', (done) => {
      var server = createServer('X-HTTP-Method-Override', { methods: null })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('DELETE', done)
    })

    it('should not call getter when method not allowed', (done) => {
      var server = createServer((req) => { return 'DELETE' })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .expect('PATCH', done)
    })
  })
})

function createServer(getter, opts, fn) {
  const app = new Koa()
  fn && app.use(fn)
  app.use(methodOverride(getter, opts))
  app.use(ctx => {
    ctx.body = ctx.req.method
  })
  return app.listen()
}
