const AppointmentRoutes = require("express").Router()
const { checkLogin } = require("../../middleware/authentication")
const {
    indexPage,
    deletePage,
    editPage,
} = require("../../controllers/admin/admin-appointment-controller")

AppointmentRoutes.get("/", indexPage)
AppointmentRoutes.get("/delete/:_id", checkLogin, deletePage)
AppointmentRoutes.get("/edit/:_id", editPage)
module.exports = AppointmentRoutes