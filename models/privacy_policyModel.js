const mongoose = require('mongoose')
const privacy_policySchema = new mongoose.Schema({

    Heading : {
        type : String
    },

    Description : {
        type : String
    },

    Hotel_Id : {
        type : String
    }

}, {timestamps : true })

const privacy_policyModel = mongoose.model('privacy_policy', privacy_policySchema)

module.exports = privacy_policyModel