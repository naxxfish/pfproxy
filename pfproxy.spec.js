const request = require('request'),
   sinon = require('sinon'),
   PFInterface = require('pfint'),
   chai = require('chai'),
   sinonChai = require("sinon-chai");

chai.should()
const expect = chai.expect
chai.use(sinonChai)

const PFProxy = require('./pfproxy')

const validConfig =
   {
     pathfinder: {
        'host': "127.0.0.1",
        'username': "PFInterface",
        'password': "PFInterface",
        'port': 9500
     },
     http: {
        'method': "POST",
        'endpoint': "http://example.com/api/v0.1/endpoint?getparam=thingy"
     }
  }

describe('Pathfinder Interface proxy to HTTP requests', function () {

   it('accepts a valid configuration', function () {
      const pfproxy = new PFProxy();
      // should not throw an error
      pfproxy.configure(validConfig)
   })

   it('rejects an invalid configuration', function () {
      const pfproxy = new PFProxy();
      const invalidConfig =
         {
           pathfinder: {
              'host': 92,
              'username': "PFInterface",
              'password': "PFInterface",
              'port': "hello"
           },
           http: {
              'method': "POST",
              'endpoint': 42
           }
        }
           // should throw an error

      expect(function () { pfproxy.configure(invalidConfig) }).to.throw
   })

   it('cannot be configured more than once', function () {
      const pfproxy = new PFProxy();
      pfproxy.configure(validConfig)
      // should throw an error
      expect(function () { pfproxy.configure(validConfig) }).to.throw
   })

   it('must be configured at least once', function () {
      const pfproxy = new PFProxy();
      expect(function () { pfproxy.start(); }).to.throw
   })

   it('requests sync from pfint', function () {
      const pfproxy = new PFProxy();
      pfproxy.configure(validConfig)
      sinon.stub(pfproxy.pfint, 'sync', function () {})
      pfproxy.connect()
      pfproxy.pfint.sync.should.have.been.calledOnce()
   })
})
