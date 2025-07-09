const DepartmentRouter = require("express").Router()
const encoder = require("../../middleware/bodyParser")
const { departmentUploader } = require("../../middleware/fileUploader")
const { checkLogin } = require("../../middleware/authentication")

const {
    indexPage,
    createPage,
    storePage,
    showPage,
    deletePage,
    editPage,
    updatePage
} = require("../../controllers/admin/admin-department-controller")

DepartmentRouter.get("/", indexPage)
DepartmentRouter.get("/create", createPage)
DepartmentRouter.post("/store", departmentUploader.single("cover"), encoder, storePage)
DepartmentRouter.get("/show/:_id", showPage)
DepartmentRouter.get("/delete/:_id",checkLogin, deletePage)
DepartmentRouter.get("/edit/:_id", editPage)
DepartmentRouter.post("/update/:_id", departmentUploader.single("cover"), encoder, updatePage)

module.exports = DepartmentRouter



