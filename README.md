# OORedis, aka rxjs-observable-of-redis-cmd
Create an rxjs6 obserbable from a generic redis command. 

## pure console
```javascript

//we only need the basic to obtail a simple value from redis. 
var OOredis = require("rxjs-observable-of-redis-cmd")
var conf = {host: 'localhost', port: 6379}

var setFoo$ = OOredis('set', ['fookey', 'foovalue'], conf)
var getFoo$ = OOredis('get', 'fookey', conf)

setFoo$.subscribe(console.log, console.error) //1 or 0 
getFoo$.subscribe(console.log, console.error) // nil or value

//we can use to set different types whith the correct command 
var sethmsetFeatures =  OOredis(
    'hmset' , //cmd
    ['features', 
    'feature01', 'false',
    'feature02', 'false',
    'feature04', 'true'],
    conf
).subscribe(console.log)

var hmgetAllFeatures = OOredis(
   'hgetall',
   'features',
   redisConfig
).subscribe(console.log)
//All commands availiable in the redis client can be converted in observables 

var allKeys = OORedis('keys', '*')
var someNamespaceKeys = OORedis('keys', '*someNamespaceKeys*')

allKeys.subscribe(console.log)
someNamespaceKeys.subscribe(console.log)


```


## inside nodejs and express  
```javascript
import express from 'express'
import OORedis from 'rxjs-observable-of-redis-cmd'

const redisConfig = Object.freeze({//todo refactor 2 config file.
  host: 'localhost', //or remote redis
  port: '6379',
})

const app = express()

app.listen(
  8888,
  () => console.info('Server running on port ', 8888),
)


app.get('/features', function (req, res) {
  OORedis(
    'hgetall',
    'features',
    redisConfig
  )
  .subscribe(
    (next) => {res.json(next)},
    console.error,
  )
})

app.post('/features', function (req, res) {
  OORedis(
    'hmset' ,
    ['features',
    'feature01', 'false',
    'feature02', 'false',
    'feature04', 'true'],
    redisConfig
    )
  .subscribe(
    (next) => {res.json(next)},
    console.error
  )
})

```
 
## inside React component 
```javascript

//inside a component...

class App extends Component {
componentDidMount() {
  OOredis('get' , 'somekey').subscribe(this.setState)
    
}
}
```
