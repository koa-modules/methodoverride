const koa = require('koa')
const methodOverride = require('..')
const request = require('supertest')

describe('methodOverride(getter)', function(){
  it('should not touch the method by default', function(done){
    var server = createServer()
    request(server)
    .get('/')
    .expect('GET', done)
  })

  it('should use X-HTTP-Method-Override by default', function(done){
    var server = createServer()
    request(server)
    .post('/')
    .set('X-HTTP-Method-Override', 'DELETE')
    .expect('DELETE', done)
  })

  describe('with query', function(){
    it('should work missing query', function(done){
      var server = createServer('_method')
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('POST', done)
    })

    it('should be case in-sensitive', function(done){
      var server = createServer('_method')
      request(server)
      .post('/?_method=DElete')
      .set('Content-Type', 'application/json')
      .expect('DELETE', done);
    })

    it('should handle key referencing array', function(done){
      var server = createServer('_method')
      var test = request(server).post('/')
      test.request().path += '?_method=DELETE&_method=PUT' // supertest mangles query params
      test.set('Content-Type', 'application/json')
      test.expect('DELETE', done)
    })

    it('should only work with POST', function(done){
      var server = createServer('_method')

      request(server)
      .delete('/?_method=PATCH')
      .set('Content-Type', 'application/json')
      .expect('DELETE', done)
    })
  })

  describe('with header', function(){
    var server
    before(function () {
      server = createServer('X-HTTP-Method-Override')
    })

    it('should work missing header', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('POST', done)
    })

    it('should be case in-sensitive', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELete')
      .expect('DELETE', done)
    })

    it('should ignore invalid methods', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'BOGUS')
      .expect('POST', done)
    })

    it('should handle multiple headers', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE, PUT')
      .expect('DELETE', done)
    })

    it('should set Vary header', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('Vary', 'X-HTTP-Method-Override')
      .expect('DELETE', done)
    })

    it('should set Vary header even with no override', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('Vary', 'X-HTTP-Method-Override')
      .expect('POST', done)
    })
  })

  describe('with function', function(){
    var server
    before(function () {
      server = createServer(function(req){
        return req.headers['x-method-override'] || 'PaTcH'
      })
    })

    it('should work missing header', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('PATCH', done)
    })

    it('should be case in-sensitive', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-Method-Override', 'DELete')
      .expect('DELETE', done)
    })

    it('should ignore invalid methods', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-Method-Override', 'BOGUS')
      .expect('POST', done)
    })
  })

  describe('given "options.methods"', function(){
    it('should allow other methods', function(done){
      var server = createServer('X-HTTP-Method-Override', { methods: ['POST', 'PATCH'] })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('DELETE', done)
    })

    it('should allow all methods', function(done){
      var server = createServer('X-HTTP-Method-Override', { methods: null })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('DELETE', done)
    })

    it('should not call getter when method not allowed', function(done){
      var server = createServer(function(req){ return 'DELETE' })
      request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .expect('PATCH', done)
    })
  })
})

function createServer(getter, opts, fn) {
  const app = koa()
  fn && app.use(fn)
  app.use(methodOverride(getter,opts))
  app.use(function *() {
    this.body = this.request.method
  })
  return app.listen()
}
