/**
 * @description 水样信息
 */
const { exec } = require('../db/mysql')

// 获取水样数据 --- 区
const getDataDistrict = async (name='深圳市', months=6) => {
    let sql = `SELECT * FROM district_datas WHERE district='${name}' ORDER BY month DESC LIMIT ${months};`;  
    const res = await exec(sql);

    return res;
};

// 获取水样数据 --- 水厂
const getDataFactory = async (name='', months=6) => {
    if (name === '') { return []; }
    let sql = `SELECT * FROM factory_datas WHERE name='${name}' ORDER BY month DESC LIMIT ${months};`;  
    const res = await exec(sql);

    return res;
};

// 后台部分
// 获取区域水样信息
const getDataAreaList = async (page=1, size=5, search, startTime, endTime) => {
    // 计算要跳过的行数，实现分页
    const offset = (page - 1) * size;
        
    // 构建 SQL 查询，并使用 LIMIT 和 OFFSET 子句进行分页
    let sql = `SELECT * FROM district_datas`;
    let countSql = `SELECT COUNT(*) AS total FROM district_datas`;
    if (search || startTime || endTime) {
        sql += ` WHERE`;
        countSql += ` WHERE`;
    }

    if (search) {
        sql += ` district LIKE '%${search}%'`;
        countSql += ` district LIKE '%${search}%'`;
    }
    if (startTime && endTime) {
        if (search) {
            sql += ` AND`;
            countSql += ` AND`;
        }
        sql += ` month >= '${startTime}' AND month <= '${endTime}'`;
        countSql += ` month >= '${startTime}' AND month <= '${endTime}'`;
    }

    sql += ` LIMIT ${size} OFFSET ${offset}`;

    // 执行查询并返回结果
    const [items, totalRes] = await Promise.all([
        exec(sql),
        exec(countSql)
    ]);
    const total = totalRes[0].total;

    return { items, total };
};

// 获取水厂水样信息
const getDataFactoryList = async (page=1, size=5, factoryName, districtName, startTime, endTime) => {
    // 计算要跳过的行数，实现分页
    const offset = (page - 1) * size;
        
    // 构建 SQL 查询，并使用 LIMIT 和 OFFSET 子句进行分页
    let sql = `SELECT * FROM factory_datas`;
    let countSql = `SELECT COUNT(*) AS total FROM factory_datas`;
    if (factoryName || districtName || startTime || endTime) { 
        sql += ` WHERE`;
        countSql += ` WHERE`;
    }

    if (factoryName) {
        sql += ` name LIKE '%${factoryName}%'`;
        countSql += ` name LIKE '%${factoryName}%'`;
    }
    if (districtName) {
        if (factoryName) {
            sql += ` AND`;
            countSql += ` AND`;
        }
        sql += ` district LIKE '%${districtName}%'`;
        countSql += ` district LIKE '%${districtName}%'`;
    }
    if (startTime && endTime) {
        if (factoryName || districtName) {
            sql += ` AND`;
            countSql += ` AND`;
        }
        sql += ` month >= '${startTime}' AND month <= '${endTime}'`;
        countSql += ` month >= '${startTime}' AND month <= '${endTime}'`;
    }
    sql += ` LIMIT ${size} OFFSET ${offset}`;

    // 执行查询并返回结果
    const [items, totalRes] = await Promise.all([
        exec(sql),
        exec(countSql)
    ]);
    const total = totalRes[0].total;

    return { items, total };
};

module.exports = {
    getDataDistrict, getDataFactory,
    getDataAreaList, getDataFactoryList
}