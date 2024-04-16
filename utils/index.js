/**
 * @description 工具类
 */
// 最近月份，开始的年份
const subtractMonths = (inputDate, monthsToSubtract) => {
    const dateParts = inputDate.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    
    // 减去月份
    const newMonth = month - monthsToSubtract;
    let newYear = year;
    
    // 处理跨年的情况
    while (newMonth <= 0) {
        newMonth += 12;
        newYear -= 1;
    }
    
    // 将结果格式化为字符串
    const resultMonth = newMonth < 10 ? `0${newMonth}` : `${newMonth}`;
    return `${newYear}-${resultMonth}`;
}

module.exports = {
    subtractMonths
}