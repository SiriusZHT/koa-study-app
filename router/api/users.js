const Router = require("koa-router");
const router = new Router();
const bcrypt = require("bcryptjs");
//引入tools
const tools = require("../../config/tools");
//引入user
const User = require("../../models/User");


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

    //存储到数据库
    const findResult = await User.find({ email: ctx.request.body.email })
    console.log(findResult);

    if(findResult.length > 0){
        ctx.status = 500;//已到达服务器但是查不到 语法错误
        ctx.body = { email: '邮箱已被占用'}
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
    //查询
    const findResult = await User.find({ email: ctx.request.body.email })

    //判断查没查到
    if(findResult.length == 0){
        ctx.status = 404;
        ctx.body = { email: "用户不存在" }；
    } else {
        //查到后 验证密码
        let result = await brcypt.compareSync()
    }
})


module.exports = router.routes();