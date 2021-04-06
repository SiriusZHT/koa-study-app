const Validator = require('validator');
const { isEmpty } = require('../config/tools')
module.exports = function validateRegisterInput(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

    !Validator.isLength(data.name, {min: 6, max: 16}) && (errors.name = "名字的长度不能小于6位，且不能超过16位")
    Validator.isEmpty(data.name) && (errors.name = "名字不能为空");
    !Validator.isEmail(data.email) && (errors.email = "邮箱不合法");
    Validator.isEmpty(data.email) && (errors.email = "邮箱不能为空"); //!
    !Validator.isLength(data.password, {min: 6, max: 16}) && (errors.password = "密码的长度不能小于6位，且不能超过16位")
    Validator.isEmpty(data.password) && (errors.password = "密码不能为空");
    Validator.isEmpty(data.confirmPassword) && (errors.confirmPassword = "确认密码不能为空");
    !Validator.equals(data.password, data.confirmPassword) && (errors.confirmPassword = "两次密码必须一致");

    return { 
        errors,
        isValid: isEmpty(errors)
    }
}