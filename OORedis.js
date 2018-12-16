"use strict"

var Observable = require('rxjs').Observable
var redis = require('redis')

var module = module || {}
module.exports = function OORedis (redisCmdName, redisParams, redisConfig) {
  return Observable.create(function (observer) {
    var rclient = redis.createClient(redisConfig.port, redisConfig.ip)
    rclient.on('connect', function () {
      assertIsValidRedisClientCmd()
      rclient[redisCmdName](redisParams, (err, result) => {
        console.log('result in observable:', result)//TODO: borrame.
        if ( null !== err) {
          observer.error(err)
          observer.complete()
        }
        observer.next(result)
        observer.complete()
      })
    })
      function assertIsValidRedisClientCmd () {
    if ( !typeof rclient[redisCmdName] === 'function' )  {
      observer.error( redisCmdName + ' not valid redis cmd')
    }
  }
    return {
      unsubscribe: function () {
        rclient.quit()
      },
    }
  })


}