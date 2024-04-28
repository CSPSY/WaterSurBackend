const router = require('koa-router')();
const { getDataDistrict, getDataFactory,
    getDataAreaList, getDataFactoryList, delWaterFactoryInfo, editWaterFactoryInfo } = require('../controller/water.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.prefix('/water');

// 获取水样信息 --- 区/市
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

// 获取水样信息 --- 水厂
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

// 获取区域水样信息
router.get('/area-list', async (ctx, next) => {
    const { page, size, search, startTime, endTime } = ctx.query;
    const data = await getDataAreaList(page, size, search, startTime, endTime);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

// 获取水厂水样信息
router.get('/factory-list', async (ctx, next) => {
    const { page, size, factoryName, districtName, startTime, endTime } = ctx.query;
    const data = await getDataFactoryList(page, size, factoryName, districtName, startTime, endTime);
    if (data) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel('Error');
    }
});

// 删除水厂水样信息
router.delete('/factory/:id', async (ctx, next) => {
    const id = ctx.params.id;
    
    const data = await delWaterFactoryInfo(id);

    if (data.code === 0) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

// 编辑水厂水样信息
router.put('/factory/:id', async (ctx, next) => {
    const id = ctx.params.id;
    const waterInfo = ctx.request.body;

    const data = await editWaterFactoryInfo(id, waterInfo);

    if (data.code === 0) {
        ctx.body = new SuccessModel(data);
    } else {
        ctx.body = new ErrorModel(data.message);
    }
});

module.exports = router;
