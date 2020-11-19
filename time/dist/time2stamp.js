"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @method 转时间戳
 * @param date string | number | Date
 * @returns number
 */
function time2stamp(date) {
    try {
        var time = void 0;
        if (date instanceof Date) {
            time = date.getTime();
        }
        else if (typeof date === 'string') {
            var regex = /(\/|\-)+/g;
            if (regex.test(date)) {
                time = new Date(date.replace(regex, '/')).getTime();
            }
            else {
                time = new Date(+date).getTime();
            }
        }
        else {
            time = date;
        }
        if (isNaN(time))
            throw new Error("\u65F6\u95F4\u683C\u5F0F\u9519\u8BEF\uFF1A" + date);
        return time;
    }
    catch (err) {
        console.error(err);
    }
    return 0;
}
exports.default = time2stamp;
