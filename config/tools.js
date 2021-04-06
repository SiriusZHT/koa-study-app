const bcrypt = require("bcryptjs")
const tools = {

    //加密
    // await bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(newUser.password, salt, (err, hash) => {
    //         if (err) throw err;
    //         newUser.passwor = hash;
    //     })
    // })
    bcryptPassword(data) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(data, salt, (err, hash) => {
                    if(err) reject(err)
                    resolve(hash)
                })
            })
        })
    },

    //判断是否为空
    isEmpty(value) {
        return value == undefined || 
            value === null || 
            (typeof value === 'object' && Object.keys(value).length === 0) || 
            (typeof value === 'string' && value.trim().length === 0) 
    }

}

module.exports = tools;