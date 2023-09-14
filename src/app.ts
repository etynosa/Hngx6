import express from "express"
import 'express-async-errors'
import cors from "cors"

import { IController } from "./interfaces/controller.interface"
import { errHandler } from "./middleware/errorHandler.middleware"
import { NotFoundError } from "./errors/not-found.error"

export default class App {
    private _app
    PORT: number | string
    URL: string

    constructor(controllers: IController[], PORT: number | string = 5000, URL: string = `http://localhost:${PORT}`) {
        this._app = express()
        this.PORT = PORT
        this.URL = URL

        this._initializeMiddleware()
        this._initializeControllers(controllers)
        this._initializeErrorMiddleware()
    }
    public listen() {
        this._app.listen(this.PORT, () => {
            console.log(`App is running on ${this.URL}`)
        })
    }
    private _initializeMiddleware() {
        this._app.use(express.json())
        this._app.use(cors())
    }
    private _initializeErrorMiddleware() {
        this._app.use(errHandler)
    }
    private _initializeControllers(controllers: IController[]) {
        for (let controller of controllers) {
            this._app.use('/', controller.router)
        }
        this._app.all('*', async (req, res) => {
            throw new NotFoundError()
        })
    }
}