const { Router } = require ("express")

const usersRouter = require("./users.routes.js")
const notesRouter = require("./movienotes.routes.js")
const tagsRouter = require("./movietags.routes.js")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/notes", notesRouter)
routes.use("/tags", tagsRouter)

module.exports = routes