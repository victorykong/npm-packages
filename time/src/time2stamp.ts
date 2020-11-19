/**
 * @method 转时间戳
 * @param date string | number | Date
 * @returns number
 */
function time2stamp(date: string | number | Date): number {
    try {
        let time: string | number;

        if (date instanceof Date) {
            time = date.getTime();
        } else if (typeof date === 'string') {
            const regex = /(\/|\-)+/g;
            if (regex.test(date)) {
                time = new Date(date.replace(regex, '/')).getTime();
            } else {
                time = new Date(+date).getTime();
            }
        } else {
            time = date;
        }
        if (isNaN(time)) throw new Error(`时间格式错误：${date}`);
        return time;
    } catch (err) {
        console.error(err);
    }
    return 0;
}


export default time2stamp