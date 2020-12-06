declare type DateType = string | number | Date;
declare type OptionsType = {
    rules?: Array<(diff: number, options: {
        date: number;
        month: number;
        year: number;
    }) => string | false>;
    isNeedSuffix?: boolean;
    serverTime?: DateType;
};
/**
 * @method 格式化时间显示文本
 * @param date string | number | Date
 * @param options
 * {
 *  rules: 规则配置数组(默认规则不符合时可指定)
 *  serverTime: 服务器时间（前端从响应头中获取，传入该插件，防止用户系统时间不正确的情况）
 *  isNeedSuffix: 是否需要后缀
 * }
 * @description 目前跨月的天支持的是30天的范围 date
 */
declare function time2string(date: DateType, options?: OptionsType): string;
declare namespace time2string {
    var SEC: (diff: number) => string | false;
    var MIN: (diff: number) => string | false;
    var HOUR: (diff: number) => string | false;
    var DATE: (diff: number, { date, month, year }: {
        date: number;
        month: number;
        year: number;
    }) => string | false;
    var MONTH: (_: number, { month, year }: {
        month: number;
        year: number;
    }) => string | false;
    var YEAR: (_: number, { year }: {
        year: number;
    }) => string | false;
    var config: (options: OptionsType) => (date: string | number | Date) => string;
}
export default time2string;
