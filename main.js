'use strict'

const nconf = require('nconf'), PFInterface = require('pfint'), PFProxy = require('./pfproxy')
if (require.main === module) {
   try {
      nconf.argv()
         .env()
      if (nconf.get('environment') == "live")
         nconf.file({ file: 'config/live.json' })
      else
         nconf.file({ file: 'config/dev.json'})

      nconf.defaults({
           'pathfinder' : {
              'port': 9500
           },
           'http' : {
              'method': "POST"
           }
        })

      nconf.required([
         'pathfinder:host',
         'pathfinder:port',
         'pathfinder:username',
         'pathfinder:password',
         'http:endpoint'
      ]);
   } catch (err)
   {
      console.error("Cannot start " + err);
      process.exit(2);
   }

    var pfproxy = new PFProxy();
    pfproxy.configure({
      pathfinder: {
         'host':nconf.get('pathfinder:host'),
         'username': nconf.get('pathfinder:username'),
         'password': nconf.get('pathfinder:password'),
         'port': nconf.get('pathfinder.port')
      },
      http: {
         'method':nconf.get('http:method'),
         'endpoint': nconf.get('http:endpoint')
      }
   })
   pfproxy.connect()
}
