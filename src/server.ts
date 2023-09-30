require('dotenv').config()

import App from "./app"
import Home from "./controllers/home.controller"
import Task1Controller from "./controllers/task1.controller"
import validateEnv from "./utils/validateENV.util"
import { PersonController } from "./controllers/person.controller"
import { PersonService } from "./services/person.service"
import Person from "./models/person.model"
import Database from "./utils/database.util"
import { DatabaseConnectionError } from "./errors/database-connection.error"
import { VideoController } from "./controllers/video.controller"
import { VideoService } from "./services/video.service"
import Video from "./models/video.model"

(async () => {
    // ensure required env variables are present
    validateEnv()
    // Other variables declaration
    const URL = process.env.URL || 'http://localhost:5000'
    const PORT = process.env.PORT || 5000

    try {
        await new Database(process.env.DB_URI!).connect()
    } catch (error) {
        throw new DatabaseConnectionError()
    }

    const app = new App([
        new Home(URL),
        new Task1Controller(),
        new PersonController(new PersonService(Person)),
        new VideoController(new VideoService(Video))
    ], PORT, URL)

    app.listen()
})()