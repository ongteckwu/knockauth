import jwt from "jsonwebtoken"

class Knocks {
  public count = 0
  public lastTimeStamp = null
}

export default class KnockAuth {
  private minMsGap: number
  private maxMsGap: number
  private repeatTimes: number
  private accessDeniedMessage: string
  private ipTable = new Map<string, Knocks>()

  constructor(repeatTimes: number, minMsGap: number = 1000, maxMsGap: number = 10000, accessDeniedMessage: string = "Access Denied") {
    this.repeatTimes = repeatTimes
    this.minMsGap = minMsGap
    this.maxMsGap = maxMsGap
    this.accessDeniedMessage = accessDeniedMessage
  }

  getMiddleware(privateKey: string) {
    const self = this
    return function(req, res, next) {
      const token = req.headers["x-access-token"] || req.headers["authorization"];
      if (!token) return res.status(401).send("Access denied. No token provided.");
      try {
        const decoded = jwt.verify(token, privateKey);
        req.user = decoded;
        next();
      } catch (ex) {
        res.status(400).send(self.accessDeniedMessage);
      }
    }
  }

  toAllowAccess(req): boolean {
    const ip = req.ip
    if (!this.ipTable.has(ip)) {
      this.ipTable.set(ip, new Knocks())
    }
    const knocks = this.ipTable.get(ip)

    if (knocks.count > this.repeatTimes) {
      return true
    }

    if (knocks.count === 0) {
      knocks.count++
      knocks.lastTimeStamp = Date.now()
    }
    else if (knocks.count > 0) {
      const now = Date.now()
      const gap = (knocks.lastTimeStamp - now)
      if (gap < this.minMsGap || gap > this.maxMsGap) {
        // reset
        this.ipTable.set(ip, new Knocks())
        return false
      }

      knocks.count++
      knocks.lastTimeStamp = now
    }
  }
}
