// connect to redis
var redis = require('redis');

var options = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '6379',
  password: process.env.PASSWORD
}

const ipList = [
  {
    ipAddress: '1.1.1.3',
    context: 'some new context for 1.1.1.3'
  }
]

const githubCommitHash = 'github12'

var client = redis.createClient(options);

client.on('connect', function() {
    console.log('connected');
});

// lookup the latest commit hash
client.get('commitHash', (error, result) => {
    // TODO: use github api to lookup the latest commit hash in firehol repo

    // TODO use github api to get all of the IP addresses in firehol repo
    
    
    if(githubCommitHash !== result) {
      // expire all the current keys
      client.keys('*', function(err, keys) {
        keys.forEach(key => {
          client.expire(key, 60*60, (err, reply) => {
            if(reply) console.log('keys expired')
              // if they aren't the same replace the list in redis with these ones.
              ipList.forEach(value => {
                client.set(value.ipAddress, value.context, function(err, reply) {
                  if(reply === 'OK') console.log(value + ' address added')
                })
              })

              
          })
        })
      })

      client.set('commitHash', githubCommitHash, (err, reply) => {
        if(reply === 'OK') console.log('commit hash added')
      })
    } else {
      console.log('nothing to update')
    }
    
})


