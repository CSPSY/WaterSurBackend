const router = require('koa-router')();
const { getDataDistrict, getDataFactory, getDataAreaList, getDataFactoryList } = require('../controller/water.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/water');

router.get('/data/district', async (ctx, next) => {
    const name = ctx.query.name ? ctx.query.name : '深圳市';
    const months = ctx.query.months ? parseInt(ctx.query.months, 10) : 6;

    const data = await getDataDistrict(name, months);
    if (data) {
        ctx.body = new SuccessModel(data);
        ctx.body.total = months;
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

router.get('/data/factory', async (ctx, next) => {
    if (!ctx.query.name) {
        ctx.body = new ErrorModel('Error');
        return;
    }
    const name = ctx.query.name;
    const months = ctx.query.months ? parseInt(ctx.query.months, 10) : 6;

    const data = await getDataFactory(name, months);
    if (data) {
        ctx.body = new SuccessModel(data);
        ctx.body.total = months;
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

router.get('/area-list', async (ctx, next) => {
    const { page, size, search, startTime, endTime } = ctx.query;
    const data = await getDataAreaList(page, size, search, startTime, endTime);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

router.get('/factory-list', async (ctx, next) => {
    const { page, size, factoryName, districtName, startTime, endTime } = ctx.query;
    const data = await getDataFactoryList(page, size, factoryName, districtName, startTime, endTime);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

module.exports = router;
