/**
 * @description 用户信息
 */
const { exec } = require('../db/mysql');
const jwt = require('jsonwebtoken');

// 获取用户列表
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

// 登录
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
    const token = jwt.sign({ userId: user[0].id, username: user[0].username, role: user[0].role }, '1234567890-=', { expiresIn: '1h' });

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

// 根据 token 获取用户信息
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

// 添加用户
const addUser = async (data) => {
    const { username, password, realname, email, role, telephone } = data;
    if (!email || !password || role !== 0 && role !== -1) {
        return { message: '添加用户失败' };
    }

    let sql = `SELECT * FROM users WHERE email='${email}'`;
    const user = await exec(sql);
    
    if (user.length > 0) {
        return {
            message: '该邮箱已注册'
        };
    }

    sql = `INSERT INTO users (username, password, realname, role, telephone, email)
        VALUES ('${username}', '${password}', '${realname}', ${role}, '${telephone}', '${email}')`;
    await exec(sql);

    return {
        code: 0,
        message: '添加用户成功'
    };
};

// 删除用户
const delUser = async (userId) => {
    let sql = `SELECT * FROM users WHERE id=${userId}`;
    const user = await exec(sql);

    if (user.length === 0) {
        return { message: '该用户不存在' };
    }

    sql = `DELETE FROM users WHERE id=${userId}`;
    await exec(sql);

    return {
        code: 0,
        message: '删除用户成功'
    };
};

// 编辑用户
const editUser = async (userId, data) => {
    let sql = `SELECT * FROM users WHERE id=${userId}`;
    const user = await exec(sql);

    if (user.length === 0) {
        return { message: '该用户不存在' };
    }

    const username = data.username || user[0].username;
    const realname = data.realname || user[0].realname;
    const role = data.role || user[0].role;
    const telephone = data.telephone || user[0].telephone;
    
    sql = `UPDATE users SET username='${username}', realname='${realname}',
        role=${role}, telephone='${telephone}' WHERE id=${userId}`;
    await exec(sql);
    
    return {
        message: '编辑用户信息成功'
    };
};

module.exports = {
    getUserData, loginAdmin, getUserInfo,
    addUser, delUser, editUser
}