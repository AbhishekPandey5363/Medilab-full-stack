const fs = require("fs")
const Service = require("../../models/Service")
const Newsletter = require("../../models/Newsletter")

const mailer = require("../../mailer/index")

async function indexPage(req, res) {
    try {
        let data = await Service.find().sort({ "sortOrder": 1 })
        res.render("admin/service/index", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            data: data,
            session: req.session
        })
    } catch (error) {
        console.log(error)
    }
}

function createPage(req, res) {
    res.render("admin/service/create", {
        title: `${process.env.SITE_NAME} - Admin Page`,
        currentUrl: '/admin',
        errorMessage: {},
        data: {
            sortOrder: 10
        },
        session: req.session
    })
}

async function storePage(req, res) {
    try {
        var data = new Service(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        data.createdBy = req.session.name
        await data.save()

        let newsletterData = await Newsletter.find()
        newsletterData.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `New Healthcare Service at ${process.env.SITE_NAME}  Newsletter `,
                html: `
               <div>
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd; padding: 20px;">
                <h2 style="color: #2e6da4;">🩺 New Service Alert from ${process.env.SITE_NAME}!</h2>

                <p style="font-size: 16px; color: #333333;">Dear <strong>[User's Name]</strong>,</p>

                <p style="font-size: 16px; color: #333333;">
                    We’re excited to announce a brand-new addition to our healthcare offerings – the <strong>[Service Name]</strong> department is now available at  ${process.env.SITE_NAME}!
                </p>

                <p style="font-size: 16px; color: #333333;">
                    This new service is designed to provide high-quality care with advanced technology and expert specialists. Whether you're looking for consultation, diagnosis, or long-term treatment, we've got you covered.
                </p>

                <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #2e6da4;">
                    <p style="font-size: 14px; margin: 5px 0;"><strong>Service:</strong>${data.title}</p>
                </div>

                <p style="font-size: 16px; color: #333333;">
                    Book your appointment today or learn more by visiting our website. We're always here to ensure your health and well-being.
                </p>

                <a href="${process.env.SITE_DOMAIN_FULL}/service/${data.seoUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2e6da4; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Explore the New Service</a>

                <p style="font-size: 16px; color: #2e6da4; margin-top: 30px;"><strong>Stay healthy, stay with  ${process.env.SITE_NAME}!</strong></p>

                <hr style="margin-top: 30px;">

                <p style="font-size: 14px; color: #777777;">
                    ${process.env.SITE_PHONE}<br>
                    📧 support@medilab.com<br>
                    🌐 <a href="${process.env.SITE_DOMAIN}" style="color: #2e6da4;"> ${process.env.SITE_NAME}</a>
                </p>
                </div>
               </div>
            `
            })

        })

        res.redirect("/admin/service")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Service With This Title Already Exist" : null
        error?.keyValue?.seoUrl ? errorMessage.seoUrl = "A Service With This SeoUrl Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.seoUrl ? errorMessage.seoUrl = error.errors.seoUrl.message : null
        error?.errors?.icon ? errorMessage.icon = error.errors.icon.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error?.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null

        res.render("admin/service/create", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}

async function showPage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/show", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                session: req.session
            })
        }
        else
            res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function deletePage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function editPage(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/edit", {
                title: `${process.env.SITE_NAME} - Admin Page`,
                currentUrl: '/admin',
                data: data,
                errorMessage: {},
                session: req.session
            })
        }
        else
            res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function updatePage(req, res) {
    try {
        var data = await Service.findOne({ _id: req.params._id })
        if (data) {
            data.title = req.body.title
            data.seoUrl = req.body.seoUrl
            data.icon = req.body.icon
            data.shortDescription = req.body.shortDescription
            data.longDescription = req.body.longDescription
            data.metaTitle = req.body.metaTitle
            data.metaDescription = req.body.metaDescription
            data.metaKeywords = req.body.metaKeywords
            data.sortOrder = req.body.sortOrder
            data.active = req.body.active
            data.updatedBy.push({
                user: req.session.name,
                time: new Date()
            })
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.cover)
                } catch (error) { }
                data.cover = req.file.path
            }
            await data.save()
        }
        res.redirect("/admin/service")
    } catch (error) {
        try {
            if (req.file)
                fs.unlinkSync(req.file.path)
        } catch (error) {
            console.log(error)
        }

        let errorMessage = {}
        error?.keyValue?.title ? errorMessage.title = "A Service With This Title Already Exist" : null
        error?.keyValue?.seoUrl ? errorMessage.seoUrl = "A Service With This SeoUrl Already Exist" : null
        error?.errors?.title ? errorMessage.title = error.errors.title.message : null
        error?.errors?.seoUrl ? errorMessage.seoUrl = error.errors.seoUrl.message : null
        error?.errors?.icon ? errorMessage.icon = error.errors.icon.message : null
        error?.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error?.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error?.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null

        res.render("admin/service/edit", {
            title: `${process.env.SITE_NAME} - Admin Page`,
            currentUrl: '/admin',
            errorMessage: errorMessage,
            data: data,
            session: req.session
        })
    }
}

module.exports = {
    indexPage: indexPage,
    createPage: createPage,
    storePage: storePage,
    showPage: showPage,
    deletePage: deletePage,
    editPage: editPage,
    updatePage: updatePage,
}