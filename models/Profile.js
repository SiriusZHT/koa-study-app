const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//实例化数据模板
const ProfileSchema = new Schema({
    user: { // 关联表
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    handle: {
        type: String,
        required: true,
        max: 16
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    experience: [
        {
            current: {
                type: Boolean,
                default: true,
                // required: true
            },
            location: {
                type: String,
                // required: true
            },
            from: {
                type: Date,
                // required: true
            },
            to: {
                type: Date,
                // required: true
            }
        }
    ],
    socialMedia: {
        wechat: {
            type: String,
            // required: false
        }, 
        QQ: {
            type: String,
            // required: false
        }, 
        github: {
            type: String,
            // required: false
        }, 
    },
    date: {
        type: Date,
        // required: true
    },
    __v: {
        type: Number,
        // required: true
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);