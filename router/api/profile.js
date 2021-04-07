const Router = require('koa-router');
const router = new Router();
// import profile
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const passport = require('passport');
const mongoose = require('mongoose');
//引入验证
const validateProfileInput = require('../../validation/profile');
const validateExperientInput = require('../../validation/experiences');
/**
 * @route Get api/profile/test
 * @desc test接口地址
 * @access public
 */
router.get('/test', async ctx => {
    ctx.status = 200;
    ctx.body = { msg: 'profile works' };
})


/**
 * @route Get api/profile
 * @desc get profile
 * @access private
 */
router.get(
    '/',
    passport.authenticate('jwt', { session: false }), 
    async ctx => {
        console.log(ctx.state.user);
        const profile = await Profile.find({ user: ctx.state.user.id })
        .populate("user", ["name", "email"]);
        
        console.log(profile);

        if(!profile){
            ctx.status = 200;
            ctx.body = profile;
        } else {
            ctx.status = 404;
            ctx.body = { noprofile: "this user has no relative msg!"}
            return;
        }
    }
)

/**
 * @route Post api/profile
 * @desc add and edit profile
 * @access private
 */
router.post(
    '/',
    passport.authenticate('jwt', { session: false }), 
    async ctx => {
        const { errors, isValid } = validateProfileInput(ctx.request.body);

        //判断验证是否通过 如果没有内容
        if(!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        const profileFields = {};

        profileFields.user = ctx.state.user.id;
        ctx.request.body.handle && (profileFields.handle = ctx.request.body.handle);
        ctx.request.body.status && (profileFields.status = ctx.request.body.status);
        ctx.request.body.experience && (profileFields.experience = ctx.request.body.experience);
        ctx.request.body.date && (profileFields.date = ctx.request.body.date);
        ctx.request.body.__v && (profileFields.__v = ctx.request.body.__v);

        //skills "["eat", "sleep", "beatBeans"]" parse to array by ","
        (ctx.request.body.skills) && (profileFields.skills = ctx.request.body.skills.split(","));
        
        profileFields.socialMedia = {};
        ctx.request.body.wechat && (profileFields.socialMedia.wechat = ctx.request.body.wechat);
        ctx.request.body.QQ && (profileFields.socialMedia.QQ = ctx.request.body.QQ);
        ctx.request.body.github && (profileFields.socialMedia.github = ctx.request.body.github);

        // find 
        console.log(profileFields)
        const profile = await Profile.find({ user: profileFields.user  });
        if(profile.length > 0) {
            mongoose.set('useFindAndModify', false);
            const profileUpdate = await Profile.findOneAndUpdate(
                { user: ctx.state.user.id },
                { $set: profileFields },
                { new: true },
            );
            ctx.body = profileUpdate;
        } else {
            await new Profile(profileFields).save().then( profile => {
                ctx.status = 200;
                ctx.body = profile;
            })
        }
    }
)

/**
 * @route Get api/profile/handle?handle=test
 * @desc get profile by handle
 * @access public
 */
router.get('/handle', async ctx => {
    const errors = {};
    const handle = ctx.query.handle;
    const profile = await Profile.find({ handle: handle}).populate("user", ["name"]);
    if(profile.length > 0){
        ctx.body = profile[0];
        ctx.status = 200;
    } else {
        errors.noprofile = "未找到该用户信息";
        ctx.status = 404;
        ctx.body = errors;
    }
})



/**
 * @route Get api/profile/user?userId=blabla
 * @desc get profile by userId
 * @access public
 */
router.get('/user', async ctx => {
    const errors = {};
    const userId = ctx.query.userId;
    const profile = await Profile.find({ user: userId }).populate("user", ["name"]);
    if(profile.length > 0){
        ctx.body = profile[0];
        ctx.status = 200;
    } else {
        errors.noprofile = "未找到该用户信息";
        ctx.status = 404;
        ctx.body = errors;
    }
})

/**
 * @route Get api/profile/all
 * @desc get all users profile 
 * @access public
 */
router.get('/all', async ctx => {
    const errors = {};
    const profiles = await Profile.find({}).populate("user", ["name"]);
    if(profiles.length > 0){
        ctx.body = profiles;
        ctx.status = 200;
    } else {
        errors.noprofile = "未找到该用户信息";
        ctx.status = 404;
        ctx.body = errors;
    }
})

/**
 * @route Get api/profile/experience
 * @desc get experience profile 
 * @access private
 */
/** TODO experience */
router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const { errors, isValid } = validateExperientInput(ctx.request.body);

        //判断验证是否通过 如果没有内容
        if(!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }

        const profileFields = {
            experience: []
        };
        const profile = await Profile.find({ user: ctx.state.user.id });
        if(profile.length > 0) {
            // console.log(ctx.request.body)
            const newExp = {
                content: ctx.request.body.content,
                current: ctx.request.body.current, 
                location: ctx.request.body.location, 
                from: ctx.request.body.from, 
                to: ctx.request.body.to, 
            }
            profileFields.experience.unshift(newExp);
            // 只能find one and update，但是不能追加
            // const profileUpdate = await Profile.findOneAndUpdate(
            //     { user: ctx.state.user.id },
            //     { $set: profileFields },
            //     { new: true }
            // );

            const profileUpdate = await Profile.update(
                { user: ctx.state.user.id },
                { $push: { experience: profileFields.experience } },
                { $sort: 1 }
            );
            // ctx.body = profileUpdate;
            if(profileUpdate.ok == 1){
                const profile = await Profile.find({ user: ctx.state.user.id})
                .populate("user", ["name"]);
            }
            if(profile){
                ctx.status = 200;
                ctx.body = profile;
            }

        } else {
            errors.noprofile = "没有该用户的信息";
            ctx.status = 404;
            ctx.body = errors;
        }
    } 
)

/**
 * @route DELETE api/profile/experience?expId=blabla
 * @desc delete experience profile 
 * @access private
 */
/** TODO experience */
router.delete(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        // get expId
        const expId = ctx.query.expId;
        // console.log(expId);
        // find expId
        const profile = await Profile.find({ user: ctx.state.user.id });
        if(profile[0].experience.length){
            const removeIndex = profile[0]
            .experience.map(item => item.id)
            .indexOf(expId);
            //remove
            profile[0].experience.splice(removeIndex, 1);
            //update
            const profileUpdate = await Profile.findOneAndUpdate(
                { user: ctx.state.user.id },
                { $set: profile[0] },
                { new: true }
            )
            ctx.body = profileUpdate;    
        } else {
            ctx.status = 404;
            ctx.body = {errors: "没有任何数据"};
        }
    } 
)



/**
 * @route DELETE api/profile
 * @desc delete all user`s experience profile 
 * @access private
 */
/** TODO experience */
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    async ctx => {
        const profile = await Profile.deleteOne(
            { user: ctx.state.user.id }
        )
        if(profile.ok == 1) {
            const user = await User.deleteOne({ _id: ctx.state.user.id });
            if(user.ok == 1) {
                ctx.status = 200;
                ctx.body = { success: true};
            }
        } else {
            ctx.status = 404;
            ctx.body = { error: "profile不存在" };
        }
    } 
)

module.exports = router.routes();