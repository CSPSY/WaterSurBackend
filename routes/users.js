const router = require('koa-router')();
const { getUserData, loginAdmin, getUserInfo } = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/user');

router.get('/data', async (ctx, next) => {
    const { page, size, search } = ctx.query;
    const data = await getUserData(page, size, search);

    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    
    const data = await loginAdmin(email, password);
    if (data.token) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

router.get('/info', async(ctx, next) => {
    const { userId, username } = ctx.state.user;

    const data = await getUserInfo(userId, username);
    
    if (data.user) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

module.exports = router;
