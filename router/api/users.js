const Router = require("koa-router");
const router = new Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
//引入tools
const tools = require("../../config/tools");
//引入user
const User = require("../../models/User");
//引入token的keys
const keys = require("../../config/keys")
const passport = require("koa-passport")
//引入input验证
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get("/test", async (ctx) => {
    ctx.status = 200;
    ctx.body = { msg: 'users works...'};
})

/**
 * @route Post api/users/register
 * @desc register接口地址
 * @access 接口是公开的
 */
router.post("/register", async (ctx) => {
    // console.log(ctx.request.body)

    const { errors, isValid } = validateRegisterInput(ctx.request.body);

    //判断验证是否通过 如果没有内容
    if(!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }
    //存储到数据库
    const findResult = await User.find({ email: ctx.request.body.email })
    console.log(findResult);

    if(findResult.length > 0){
        ctx.status = 500;//已到达服务器但是查不到 语法错误
        ctx.body = { email: '邮箱已被占用' }
    } else {
        //没查到
        const newUser = new User({
            name: ctx.request.body.name,
            email: ctx.request.body.email,
            password: ctx.request.body.password
        })

        newUser.password = await tools.bcryptPassword(newUser.password);
        //存储到数据库
        await newUser
        .save()
        .then((user) => {
            ctx.body = user;
        }).catch((err) => {
            console.warn(err)
        })
 
        //返回json数据
        ctx.body = newUser;
    }
})

/**
 * @route Post api/users/login
 * @desc login接口地址 返回token
 * @access 接口是公开的
 */
router.post("/login", async (ctx) => {

    const { errors, isValid } = validateLoginInput(ctx.request.body);
    //判断验证是否通过 如果没有内容
    if(!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    //查询 
    const findResult = await User.find({ email: ctx.request.body.email })
    const password = ctx.request.body.password;
    const user = findResult[0];
    //判断查没查到
    if(findResult.length == 0){
        ctx.status = 404;
        ctx.body = { email: "用户不存在" };
    } else {
        //查到后 验证密码
        let result = await bcrypt.compareSync(password, user.password)

        //成功与否
        if(result){
            //生成token
            const payload = { id: user.id, name: user.name };
            //签名证书
            const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
            ctx.status = 200;
            ctx.body = { success: true, token: token };
            console.log(token)
        } else {
            ctx.status = 400;
            ctx.body = { password: "密码错误!" }
        }
    }
})

/**
 * @route Get api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私有的
 */
router.get("/current", passport.authenticate('jwt', { session: false }), async ctx => {
    // console.log(ctx)
    ctx.body = { 
        id: ctx.state.user.id, 
        name: ctx.state.user.name,
        email: ctx.state.user.email
    };
})


module.exports = router.routes();