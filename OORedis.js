"use strict"

var Observable = require('rxjs').Observable
var redis = require('redis')

var module = module || {}
module.exports = function OORedis (redisCmdName, redisParams, redisConfig) {
  return Observable.create(function (observer) {
    assertIsFunctionOf(rclient, redisCmdName)

    const rclient = redis.createClient(redisConfig.port, redisConfig.ip)
    rclient.on('connect', function () {
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
    return {
      unsubscribe: function () {
        //rclient.end ?
        console.log('finalizando consulta a redis')
      },
    }
  })

  function assertIsFunctionOf (obj, maybeFunction) {
    return true;//todo implement assert

  }
}