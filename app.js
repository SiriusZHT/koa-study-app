const koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const passport = require("koa-passport");


//实例化koa
const app = new koa();
const router = new Router();

//使用中间件
app.use(bodyParser());

//引入users.js
const users = require("./router/api/users");
//引入profile
const profile = require("./router/api/profile")

//路由
router.get("/", async ctx => {
    ctx.body = { msg: 'Hello Koa Interfaces' };
});

const db = require('./config/keys').mongoURI;

//连接数据库
mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false})
.then(() => {
    console.log("Mongodb Connected")}
)
.catch(err => {console.log(err)});

//
app.use(passport.initialize());
app.use(passport.session());

//回调到config文件中 
require('./config/passport')(passport);


//配置路由地址 /api/users
router.use("/api/users", users);
//配置路由地址 /api/profile
router.use("/api/profile", profile);

//配置路由
app.use(router.routes()).use(router.allowedMethods);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})