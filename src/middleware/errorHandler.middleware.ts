import { ErrorRequestHandler } from "express"
import { logEvent } from "../utils/logger"
import isDevMode from "../utils/checkNodeEnv"

export const errHandler: ErrorRequestHandler = (error: Error, req, res, next) => {
    const errMsg = `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    logEvent(errMsg, 'errLog.log')

    isDevMode() && console.log(res.statusCode, error)
    
    if (error.message === 'Forbidden') {
        return res.status(403).json({ message: "Forbidden" })
    }

    const status = (res.statusCode !== 200) ? res.statusCode : 500 // return 500 if no status code

    if (error.name === 'MongooseServerSelectionError') {
        return res.status(status).json({ message: "Server Error" })
    }

    res.status(status).json({ message: error.message })
}