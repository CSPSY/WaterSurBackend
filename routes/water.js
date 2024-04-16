const router = require('koa-router')();
const { getDataDistrict, getDataFactory } = require('../controller/waterTest.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/water');

router.get('/data/district', async (ctx, next) => {
    const name = ctx.query.name ? ctx.query.name : '深圳市';
    const months = ctx.query.months ? parseInt(ctx.query.months, 10) : 6;

    const data = await getDataDistrict(name, months);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

router.get('/data/factory', async (ctx, next) => {
    const name = ctx.query.name ? ctx.query.name : 'shenzhen';
    const months = ctx.query.months ? parseInt(ctx.query.months, 10) : 6;

    const data = await getDataFactory(name, months);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

module.exports = router;
