const mongoose = require("mongoose")

const ContactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Mendatory"]
    },
    email: {
        type: String,
        required: [true, "Email is Mendatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone is Mendatory"]
    },
    subject: {
        type: String,
        required: [true, "Subject is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },

}, { timestamps: true })

const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUs


// const ContactUsSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Name is mandatory"]
//     },
//     email: {
//         type: String,
//         required: [true, "Email is mandatory"]
//     },
//     phone: {
//         type: String,
//         required: [true, "Phone is mandatory"]
//     },
//     subject: {
//         type: String,
//         required: [true, "Subject is mandatory"]
//     },
//     message: {
//         type: String,
//         required: [true, "Message is mandatory"]
//     },
//     active: {
//         type: Boolean,
//         default: true
//     }
// }, { timestamps: true });

// // ✅ FIX: prevent OverwriteModelError
// const ContactUs = mongoose.models.ContactUs || mongoose.model("ContactUs", ContactUsSchema);

// module.exports = ContactUs;
