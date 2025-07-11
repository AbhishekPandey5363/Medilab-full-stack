const express = require("express")
const path = require("path")
const session = require('express-session')

require("dotenv").config()

const hbs = require("hbs")

const Router = require("./routes/index")

const app = express()

var sessionObj = {
    secret: process.env.SESSION_SECRET_KEY,
    Cookie: {}
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionObj.Cookie.secure = true // server secure cookie
}
app.use(session(sessionObj))

require("./db-connect")
app.set("view engine", "hbs")
app.use(express.static("./views/public")) //to use public files such as .css .js and  images etc
app.use("/public", express.static("public"))//use to service uploaded file
hbs.registerPartials(path.join(__dirname, "./views/partials"))

require("./helpers/index")

app.use("", Router)


let port = process.env.PORT || 8000

app.listen(port, console.log(`server is Running at http://localhost:${port}`))