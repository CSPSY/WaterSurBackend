const router = require('koa-router')();
const { getUserData, loginAdmin, getUserInfo, addUser, delUser, editUser } = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/user');

// 获取用户列表
router.get('/data', async (ctx, next) => {
    const { page, size, search } = ctx.query;
    const data = await getUserData(page, size, search);

    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

// 登录
router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    
    const data = await loginAdmin(email, password);
    if (data.token) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

// 根据 token 获取用户信息
router.get('/info', async(ctx, next) => {
    const { userId, username } = ctx.state.user;

    const data = await getUserInfo(userId, username);
    
    if (data.user) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

// 添加用户
router.post('/reg', async(ctx, next) => {
    const data = await addUser(ctx.request.body);

    if (data.code === 0) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

// 删除用户
router.delete('/:userId', async(ctx, next) => {
    const userId = ctx.params.userId;
    if (ctx.state.user.role !== 0) {
        ctx.body = new ErrorModel('用户无权限');
    }

    const data = await delUser(userId);

    if (data.code === 0) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

// 编辑用户
router.put('/:userId', async(ctx, next) => {
    const userId = ctx.params.userId;
    const newInfo = ctx.request.body;
    if (ctx.state.user.role !== 0) {
        ctx.body = new ErrorModel('用户无权限');
    }

    const data = await editUser(userId,newInfo);

    if (data.code === 0) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }    
});

module.exports = router;
