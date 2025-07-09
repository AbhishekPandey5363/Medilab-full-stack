const ServiceRouter = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { serviceUploader } = require("../../middleware/fileUploader")
const { checkLogin } = require("../../middleware/authentication")

const {
    indexPage,
    createPage,
    storePage,
    showPage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-service-controller")

ServiceRouter.get("/", indexPage)
ServiceRouter.get("/create", createPage)
ServiceRouter.post("/store", serviceUploader.single("cover"), encoder, storePage)
ServiceRouter.get("/show/:_id", showPage)
ServiceRouter.get("/delete/:_id", checkLogin, deletePage)
ServiceRouter.get("/edit/:_id", editPage)
ServiceRouter.post("/update/:_id", serviceUploader.single("cover"), encoder, updatePage)

module.exports = ServiceRouter



