/**
 * @description 用户信息
 */
const { exec } = require('../db/mysql');
const jwt = require('jsonwebtoken');

// 获取用户
const getUserData = async (page=1, size=10, search) => {
    // 计算要跳过的行数，实现分页
    const offset = (page - 1) * size;
        
    // 构建 SQL 查询，并使用 LIMIT 和 OFFSET 子句进行分页
    let sql = `SELECT * FROM users`;
    let countSql = `SELECT COUNT(*) AS total FROM users`;
    if (search) {
        sql += ` WHERE username LIKE '%${search}%'`;
        countSql += ` WHERE username LIKE '%${search}%'`;
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

const loginAdmin = async (email, password) => {
    // 查询数据库，验证用户名和密码
    const sql = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
    const user = await exec(sql);
    
    if (user.length === 0) {
        return {
            message: '登陆失败：用户名或密码不正确'
        };
    }
    
    // 用户身份验证成功，生成访问令牌（JWT）
    const token = jwt.sign({ userId: user[0].id, username: user[0].username }, '1234567890-=', { expiresIn: '1h' });

    return {
        token,
        user: {
            id: user[0].id,
            username: user[0].username,
            telephone: user[0].telephone,
            email: user[0].email,
            role: user[0].role,
            realname: user[0].realname
        },
        message: '登录成功'
    };
};

const getUserInfo = async (userId, username) => {
    // 查询数据库，验证用户名和密码
    const sql = `SELECT * FROM users WHERE id='${userId}' AND username='${username}'`;
    const user = await exec(sql);
    
    if (user.length === 0) {
        return {
            message: 'Error'
        };
    }

    return {
        user: {
            id: user[0].id,
            username: user[0].username,
            telephone: user[0].telephone,
            email: user[0].email,
            role: user[0].role,
            realname: user[0].realname
        }
    };
};

module.exports = {
    getUserData, loginAdmin, getUserInfo
}