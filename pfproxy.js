const expect = require('chai').expect,
   request = require('request'),
   PFInterface = require('pfint'),
   should = require('should')

var PFProxy = function () {}

PFProxy.prototype.configure = function (config) {
   if ( this.configured)
      throw new Error("PFProxy cannot be configured more than once")

   // make sure our config is valid
   try {
      expect(config).to.have.a.property('pathfinder').and.be.a('object')
      expect(config).to.have.a.property('http').and.be.a('object')
      expect(config.pathfinder).to.have.a.property('username').and.be.a('string')
      expect(config.pathfinder).to.have.a.property('password').and.be.a('string')
      expect(config.pathfinder).to.have.a.property('port')
      expect(config.pathfinder).to.have.a.property('host').and.be.a('string')
      expect(config.http).to.have.a.property('endpoint').and.be.a('string')
   } catch (err) {
         throw new Error(err)
   }
   this.config = config;
   this.pfint = new PFInterface();
   this.configured = true;
}

PFProxy.prototype.connect = function ()
{
   if (! this.configured)
      throw new Error("PFProxy not yet configured - call PFProxy.configure(config) first")


   this.pfint.on('connected', function () {
      this.sendUpdate({'status':'connected'})
   })

   this.pfint.on('memorySlot', function (slot) {
      this.sendUpdate({'type':'memoryslot', 'slot': slot})
   })

   this.pfint.on('route', function (route) {
      this.sendUpdate({'type':'route', 'route': route})
   })

   this.pfint.on('debug', function (message) {
      this.sendUpdate({'type':'debug', 'message': debug})
   })
   this.pfint.sync({
       'user' : this.config.pathfinder.username,
       'password' : this.config.pathfinder.password,
       'host' : this.config.pathfinder.host,
       'port' : this.config.pathfinder.port
   })
}

PFProxy.prototype.sendUpdate = function (message)
{
   var method;
   if (this.config.http.method == "POST")
      method = request.post
   else
      method = request.get
   method(this.config.http.endpoint, message, function(err,httpResponse,body){
      if (err)
      {
         console.error(httpResponse.statusCode)
         console.error(body)
      } else {
         console.log("Posted update " + JSON.stringify(message) + " " + httpResponse.statusCode + "-" + body)
      }
   })
}

module.exports = PFProxy;
