const Validator = require('validator');
const { isEmpty } = require('../config/tools')
module.exports = function validateProfileInput(data){
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    !Validator.isLength(data.handle, {min: 2, max: 40}) && (errors.handle = "handle的长度不能小于2位，且不能超过40位")
    Validator.isEmpty(data.handle) && (errors.handle = "handle不能为空");
    !Validator.isLength(data.status, {min: 2, max: 40}) && (errors.status = "status的长度不能小于2位，且不能超过40位")
    Validator.isEmpty(data.status) && (errors.status = "status不能为空");
    Validator.isEmpty(data.skills) && (errors.skills = "skills不能为空");

    
    return { 
        errors,
        isValid: isEmpty(errors)
    }
}