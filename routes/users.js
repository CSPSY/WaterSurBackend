const router = require('koa-router')();
const { getUserData } = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/user')

router.get('/data', async (ctx, next) => {
    const { page, size, search } = ctx.query;
    const data = await getUserData(page, size, search);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
})

module.exports = router
