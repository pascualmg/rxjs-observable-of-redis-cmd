'use strict'

var Observable = require('rxjs').Observable
var redis = require('redis')

var module = module || {}
module.exports = function OORedis (redisCmdName, redisParams, redisConfig) {
  return Observable.create(function (observer) {
    var rclient = redis.createClient(redisConfig.port, redisConfig.host)
    rclient.on('connect', function () {
      if (!typeof rclient[redisCmdName] === 'function'){
       observer.error(new Error('Non valid redis cmd :' + redisCmdName))
      }
      rclient[redisCmdName](redisParams, (err, result) => {
        console.log('result in observable:', result)//TODO: borrame.
        if (null !== err) {
          observer.error(err)
        }
        observer.next(result)
        observer.complete()
      })
    })
    rclient.on('error', function (err) {
      observer.error(err)
    })
    return {
      unsubscribe: function () {
        rclient.quit()
      },
    }
  })
}