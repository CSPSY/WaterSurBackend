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

module.exports = {
    getDataDistrict, getDataFactory
}