import { time2stamp } from './index';


const SYMBOL = '%t%';
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DATE = HOUR * 24;
enum DefaultText {
    second = '%t%秒',
    minute = '%t%分钟',
    hour = '%t%小时',
    date = '%t%天',
    month = '%t%个月',
    year = '%t%',
}
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
function time2string(
    dateParams: string | number | Date,
    {
        second = DefaultText.second,
        minute = DefaultText.minute,
        hour = DefaultText.hour,
        date = DefaultText.date,
        month = DefaultText.month,
        year = DefaultText.year,
    }: Template = {},
): string {
    try {
        const __handler__ = (val: number) => (Math.floor(val) === 0 ? 1 : Math.floor.call(Math, val)); // 非0处理，默认给个1。例如：1秒通过template需要显示为1分钟
        const __abs__ = Math.abs.bind(Math);
        const __isShow__ = (conf: string | false | undefined) => !(typeof conf === 'boolean' && conf === false); // 显式传递 false，才明确不显示
        const __replace__ = (date: string, val: number): string =>
            `${date.replace(SYMBOL, `${__handler__(val)}`)}${suffix}`;

        let txt = '',
            suffix = '';
        const timestamp = time2stamp(dateParams);
        const _now = new Date(),
            _target = new Date(timestamp);

        let diff = __handler__((_now.getTime() - timestamp) / 1000);
        suffix = diff < 0 ? '后' : '前';
        diff = __abs__(diff);

        const _month = __abs__(_now.getMonth() - _target.getMonth()); // 预获取月
        const _year = __abs__(_now.getFullYear() - _target.getFullYear()); // 预获取年

        switch (true) {
            case diff < MINUTE && __isShow__(second): // <60属于秒范围
                txt = __replace__(second as string, diff);
                break;
            case diff < HOUR && __isShow__(minute): // <60*60属于分钟范围
                txt = __replace__(minute as string, diff / MINUTE);
                break;
            case diff < DATE && __isShow__(hour): // <60*60*24属于小时范围
                txt = __replace__(hour as string, diff / HOUR);
                break;
            // 下面的范围使用综上判断不太准确(偏主观), 所以改用 _now - _target 的时间差
            case _month === 0 && _year === 0 && __isShow__(date): // 月为0 & 年为0(同月异年)属于天范围
                txt = __replace__(date as string, diff / DATE);
                break;
            case _month > 0 && _month <= 12 && _year === 0 && __isShow__(month): // 12=>月>0 & 年为0属于月范围
                txt = __replace__(month as string, _month);
                break;
            // 默认属于年范围, 显示年/月/日
            default:
                let y = __replace__(year as string, timestamp);
                y = y.substring(0, y.length - 1); // 删除末尾的suffix
                txt = y.replace(`${timestamp}`, `${new Date(timestamp).toLocaleDateString()}`);
                break;
        }
        return txt;
    } catch (err) {
        console.error(err);
    }
    return '';
}

export default time2string