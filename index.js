const express= require("express")
const app =express()
const cors = require("cors")
app.use(express.json())
app.use(cors())
const {connect} = require("./db/connection")

connect()
const user  = require('./routes/user.routes')
const errorHandler = async (error,req, res, next) => {
    const status = error.status|| 400;
    res.status(status).send(error.message)
}
app.use('/', user)
app.use(errorHandler)
app.listen(process.env.PORT || 5000)