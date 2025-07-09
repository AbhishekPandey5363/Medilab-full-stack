const NewsletterRoutes = require("express").Router()
const { checkLogin } = require("../../middleware/authentication")

const {
    indexPage,
    deletePage,
    editPage,
} = require("../../controllers/admin/admin-newsletter-controller")

NewsletterRoutes.get("/", indexPage)
NewsletterRoutes.get("/delete/:_id", checkLogin, deletePage)
NewsletterRoutes.get("/edit/:_id", editPage)
module.exports = NewsletterRoutes