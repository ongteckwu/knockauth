# knockauth
Uses `knocks` as authentication on top of your usual authentication. If a hacker gains access to a Authorization Bearer Token, the hacker will still get denied access. In order to get access, the hacker has to send requests `N` times with the same token, with a minimum duration gap of, say, `2000 milliseconds`, and a maximum duration gap of, say, `10000 milliseconds`, before access will be granted.

To allow your apps to access, simply just `knock` accordingly.

### Installation (Not implemented yet)

`npm install knockauth` 

### Usage

```
import KnockAuth from 'knockauth'
import express from 'express'

const jwtPrivateKey = "xxxxxxxxxxxx"
const numberOfKnocks = 10
const minMsGap = 2000
const maxMsGap = 10000

const knockAuth = new KnockAuth(numberOfKnocks, minMsGap, maxMsGap)
const knockAuthMiddleware = knockAuth.getMiddleware(jwtPrivateKey)

const app = express()
app.use(knockAuthMiddleware)
```

