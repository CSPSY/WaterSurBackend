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

// 删除水厂水样信息
const delWaterFactoryInfo = async (id) => {
    let sql = `SELECT * FROM factory_datas WHERE id=${id}`;
    const waterInfo = await exec(sql);

    if (waterInfo.length === 0) {
        return { message: '该水样信息不存在' };
    }

    sql = `DELETE FROM factory_datas WHERE id=${id}`;
    await exec(sql);

    sql = `SELECT 
            month, AVG(turbidity) AS avg_turbidity, AVG(platinum_cobalt_color) AS avg_platinum_cobalt_color,
            AVG(ph_value) AS avg_ph_value, AVG(free_chlorine) AS avg_free_chlorine, AVG(total_coliform) AS avg_total_coliform,
            AVG(total_bacteria) AS avg_total_bacteria, district
        FROM 
            factory_datas
        GROUP BY 
            month, district;`

    const avgWaterInfo = await exec(sql);
    sql = `UPDATE
            district_datas
        SET
            free_chlorine=${avgWaterInfo[0].avg_free_chlorine}, ph_value=${avgWaterInfo[0].avg_ph_value}, turbidity=${avgWaterInfo[0].avg_turbidity},
            platinum_cobalt_color=${avgWaterInfo[0].avg_platinum_cobalt_color}, total_coliform=${avgWaterInfo[0].avg_total_coliform},
            total_bacteria=${avgWaterInfo[0].avg_total_bacteria}
        WHERE
            district='${avgWaterInfo[0].district}' AND month='${avgWaterInfo[0].month}'`;
    await exec(sql);

    return {
        code: 0,
        message: '删除水样信息成功'
    };
};

// 编辑水厂水样信息
const editWaterFactoryInfo = async (id, data) => {
    let sql = `SELECT * FROM factory_datas WHERE id=${id}`;
    const waterInfo = await exec(sql);

    if (waterInfo.length === 0) {
        return { message: '该水样信息不存在' };
    }

    const name = data.name;
    const district = data.district;
    const month = data.month;
    const free_chlorine = data.free_chlorine;
    const ph_value = data.ph_value;
    const platinum_cobalt_color = data.platinum_cobalt_color;
    const turbidity = data.turbidity;
    const total_coliform = data.total_coliform;
    const total_bacteria = data.total_bacteria;

    sql = `UPDATE
            factory_datas
        SET
            name='${name}', district='${district}', month='${month}', free_chlorine=${free_chlorine}, ph_value=${ph_value},
            platinum_cobalt_color=${platinum_cobalt_color}, turbidity=${turbidity}, total_coliform=${total_coliform}, total_bacteria=${total_bacteria}
        WHERE
            id=${id}`;
    await exec(sql);

    sql = `SELECT 
            month, AVG(turbidity) AS avg_turbidity, AVG(platinum_cobalt_color) AS avg_platinum_cobalt_color,
            AVG(ph_value) AS avg_ph_value, AVG(free_chlorine) AS avg_free_chlorine, AVG(total_coliform) AS avg_total_coliform,
            AVG(total_bacteria) AS avg_total_bacteria, district
        FROM 
            factory_datas
        WHERE
            month='${month}' AND district='${district}'
        GROUP BY 
            month, district;`

    const avgWaterInfo = await exec(sql);
    sql = `UPDATE
            district_datas
        SET
            free_chlorine=${avgWaterInfo[0].avg_free_chlorine}, ph_value=${avgWaterInfo[0].avg_ph_value}, turbidity=${avgWaterInfo[0].avg_turbidity},
            platinum_cobalt_color=${avgWaterInfo[0].avg_platinum_cobalt_color}, total_coliform=${avgWaterInfo[0].avg_total_coliform},
            total_bacteria=${avgWaterInfo[0].avg_total_bacteria}
        WHERE
            district='${avgWaterInfo[0].district}' AND month='${avgWaterInfo[0].month}'`;
    await exec(sql);

    return {
        code: 0,
        message: '编辑水样信息成功'
    };
};

// 添加水厂水样信息
const createWaterFactoryInfo = async (data) => {
    let sql = `SELECT * FROM factory_datas WHERE name='${data.name}' AND month='${data.month}'`;
    const waterInfo = await exec(sql);

    if (waterInfo.length !== 0) {
        return { message: '该水样信息已存在' };
    }

    const name = data.name;
    const district = data.district;
    const month = data.month;
    const free_chlorine = data.free_chlorine;
    const ph_value = data.ph_value;
    const platinum_cobalt_color = data.platinum_cobalt_color;
    const turbidity = data.turbidity;
    const total_coliform = data.total_coliform;
    const total_bacteria = data.total_bacteria;

    sql = `INSERT INTO
            factory_datas (month, turbidity, platinum_cobalt_color, ph_value, free_chlorine, total_coliform, total_bacteria, district, name)
        VALUES ('${month}', ${turbidity}, ${platinum_cobalt_color}, ${ph_value}, ${free_chlorine}, ${total_coliform}, ${total_bacteria}, '${district}', '${name}');`
    await exec(sql);

    sql = `SELECT 
            month, AVG(turbidity) AS avg_turbidity, AVG(platinum_cobalt_color) AS avg_platinum_cobalt_color,
            AVG(ph_value) AS avg_ph_value, AVG(free_chlorine) AS avg_free_chlorine, AVG(total_coliform) AS avg_total_coliform,
            AVG(total_bacteria) AS avg_total_bacteria, district
        FROM 
            factory_datas
        WHERE
            month='${month}' AND district='${district}'
        GROUP BY 
            month, district;`

    const avgWaterInfo = await exec(sql);

    sql = `
        INSERT INTO district_datas (month, turbidity, platinum_cobalt_color, ph_value, free_chlorine, total_coliform, total_bacteria, district)
        VALUES ('${avgWaterInfo[0].month}', ${avgWaterInfo[0].avg_turbidity}, ${avgWaterInfo[0].avg_platinum_cobalt_color}, 
                ${avgWaterInfo[0].avg_ph_value}, ${avgWaterInfo[0].avg_free_chlorine}, ${avgWaterInfo[0].avg_total_coliform}, 
                ${avgWaterInfo[0].avg_total_bacteria}, '${avgWaterInfo[0].district}')
        ON DUPLICATE KEY UPDATE
            turbidity = VALUES(turbidity),
            platinum_cobalt_color = VALUES(platinum_cobalt_color),
            ph_value = VALUES(ph_value),
            free_chlorine = VALUES(free_chlorine),
            total_coliform = VALUES(total_coliform),
            total_bacteria = VALUES(total_bacteria);
    `;
    await exec(sql);

    return {
        code: 0,
        message: '添加水样信息成功'
    };
};

module.exports = {
    getDataDistrict, getDataFactory,
    getDataAreaList, getDataFactoryList, delWaterFactoryInfo, editWaterFactoryInfo, createWaterFactoryInfo
}