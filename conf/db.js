/**
 * @description 数据库配置
 */
const env = process.env.NODE_ENV

let MYSQL_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'water_surveilliance'
    };
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'water_surveilliance'
    };
}

module.exports = {
    MYSQL_CONF
};