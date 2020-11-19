"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var SYMBOL = '%t%';
var MINUTE = 60;
var HOUR = 60 * MINUTE;
var DATE = HOUR * 24;
var DefaultText;
(function (DefaultText) {
    DefaultText["second"] = "%t%\u79D2";
    DefaultText["minute"] = "%t%\u5206\u949F";
    DefaultText["hour"] = "%t%\u5C0F\u65F6";
    DefaultText["date"] = "%t%\u5929";
    DefaultText["month"] = "%t%\u4E2A\u6708";
    DefaultText["year"] = "%t%";
})(DefaultText || (DefaultText = {}));
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
function time2string(dateParams, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.second, second = _c === void 0 ? DefaultText.second : _c, _d = _b.minute, minute = _d === void 0 ? DefaultText.minute : _d, _e = _b.hour, hour = _e === void 0 ? DefaultText.hour : _e, _f = _b.date, date = _f === void 0 ? DefaultText.date : _f, _g = _b.month, month = _g === void 0 ? DefaultText.month : _g, _h = _b.year, year = _h === void 0 ? DefaultText.year : _h;
    try {
        var __handler__1 = function (val) { return (Math.floor(val) === 0 ? 1 : Math.floor.call(Math, val)); }; // 非0处理，默认给个1。例如：1秒通过template需要显示为1分钟
        var __abs__ = Math.abs.bind(Math);
        var __isShow__ = function (conf) { return !(typeof conf === 'boolean' && conf === false); }; // 显式传递 false，才明确不显示
        var __replace__ = function (date, val) {
            return "" + date.replace(SYMBOL, "" + __handler__1(val)) + suffix_1;
        };
        var txt = '', suffix_1 = '';
        var timestamp = index_1.time2stamp(dateParams);
        var _now = new Date(), _target = new Date(timestamp);
        var diff = __handler__1((_now.getTime() - timestamp) / 1000);
        suffix_1 = diff < 0 ? '后' : '前';
        diff = __abs__(diff);
        var _month = __abs__(_now.getMonth() - _target.getMonth()); // 预获取月
        var _year = __abs__(_now.getFullYear() - _target.getFullYear()); // 预获取年
        switch (true) {
            case diff < MINUTE && __isShow__(second): // <60属于秒范围
                txt = __replace__(second, diff);
                break;
            case diff < HOUR && __isShow__(minute): // <60*60属于分钟范围
                txt = __replace__(minute, diff / MINUTE);
                break;
            case diff < DATE && __isShow__(hour): // <60*60*24属于小时范围
                txt = __replace__(hour, diff / HOUR);
                break;
            // 下面的范围使用综上判断不太准确(偏主观), 所以改用 _now - _target 的时间差
            case _month === 0 && _year === 0 && __isShow__(date): // 月为0 & 年为0(同月异年)属于天范围
                txt = __replace__(date, diff / DATE);
                break;
            case _month > 0 && _month <= 12 && _year === 0 && __isShow__(month): // 12=>月>0 & 年为0属于月范围
                txt = __replace__(month, _month);
                break;
            // 默认属于年范围, 显示年/月/日
            default:
                var y = __replace__(year, timestamp);
                y = y.substring(0, y.length - 1); // 删除末尾的suffix
                txt = y.replace("" + timestamp, "" + new Date(timestamp).toLocaleDateString());
                break;
        }
        return txt;
    }
    catch (err) {
        console.error(err);
    }
    return '';
}
exports.default = time2string;
