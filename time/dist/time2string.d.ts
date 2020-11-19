interface Template {
    second?: string | false;
    minute?: string | false;
    hour?: string | false;
    date?: string | false;
    month?: string | false;
    year?: string;
}
/**
 * @method 格式化时间显示文本
 * @description 实现格式化时间 & 自定义显示模板（使用switch...case的优先级机制）
 * @param date string | number | Date
 * @param template 时间占位符: %t%，优先级顺序：秒>分>小时>天>月>年，如果设置某个范围为false，请确保符合逻辑，优先级将按顺序往后顺延
 *  - 如果规则不满足， 2020/1/1 2020/1/2 需要显示x月前，显然不合理，将返回空字符串
 * @returns string
 *
 * @enum
 *    YYYY-MM-DD
 * @enum
 *    x秒前/后
 *    x分钟前/后
 *    x小时前/后
 *    x天前/后
 *    x个月前/后
 * @description 不精准的数据
 * 1个月 = 30天
 * 1年 = 365天
 * @description 精准的数据
 * 1分 = 60秒
 * 1小时 = 60分
 * 1天 = 24小时
 * 1年 = 12个月
 */
declare function time2string(dateParams: string | number | Date, { second, minute, hour, date, month, year, }?: Template): string;
export default time2string;
