"use strict"

var Observable = require('rxjs').Observable
var redis = require('redis')

var module = module || {}
module.exports = function OORedis (redisCmdName, redisParams, redisConfig) {
  return Observable.create(function (observer) {
    var rclient = redis.createClient(redisConfig.port, redisConfig.host)
    rclient.on('connect', function () {
      asserts()
      rclient[redisCmdName](redisParams, (err, result) => {
        if ( null !== err) {
          observer.error(err)
        }
        observer.next(result)
        observer.complete()
      })
    })
    function asserts () {
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