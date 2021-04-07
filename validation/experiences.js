const Validator = require('validator');
const { isEmpty } = require('../config/tools')
module.exports = function validateExperienceInput(data){
    let errors = {};

    data.content = !isEmpty(data.content) ? data.content : '';
    data.current = !isEmpty(data.current) ? data.current : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // !Validator.isLength(data.handle, {min: 2, max: 40}) && (errors.handle = "handle的长度不能小于2位，且不能超过40位")
    Validator.isEmpty(data.content) && (errors.content = "content不能为空");
    // !Validator.isLength(data.status, {min: 2, max: 40}) && (errors.status = "status的长度不能小于2位，且不能超过40位")
    Validator.isEmpty(data.current) && (errors.current = "current不能为空");
    Validator.isEmpty(data.from) && (errors.from = "from不能为空");
    
    return { 
        errors,
        isValid: isEmpty(errors)
    }
}