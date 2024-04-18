/**
 * @description 用户信息
 */
const { exec } = require('../db/mysql')

// 获取用户
const getUserData = async (page=1, size=10, search) => {
    // 计算要跳过的行数，实现分页
    const offset = (page - 1) * size;
        
    // 构建 SQL 查询，并使用 LIMIT 和 OFFSET 子句进行分页
    let sql = `SELECT * FROM users`;
    let countSql = `SELECT COUNT(*) AS total FROM users`;
    if (search) {
        sql += ` WHERE column_name LIKE '%${search}%'`; // 这里替换成你的实际列名
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
    getUserData
}