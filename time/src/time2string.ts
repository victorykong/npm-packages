import getMonthBetween from "./getMonthBetween";
import { time2stamp } from "@victorykong/time";

type DateType = string | number | Date;
type OptionsType = {
  rules?: Array<
    (
      diff: number,
      options: { date: number; month: number; year: number }
    ) => string | false
  >;
  isNeedSuffix?: boolean;
  serverTime?: DateType;
};

/** 默认规则 */
/** diff:  时间戳差值 */
/** date:  日期差值 */
/** month: 月差值 */
/** year: 年差值 */
time2string.SEC = (diff: number) => (diff < 60 ? `${diff}秒` : false);
time2string.MIN = (diff: number) =>
  diff < 60 * 60 ? `${diff / 60}分钟` : false;
time2string.HOUR = (diff: number) =>
  diff < 60 * 60 * 24 ? `${diff / (60 * 60)}小时` : false;
time2string.DATE = (
  diff: number,
  { date, month, year }: { date: number; month: number; year: number }
) => {
  const sameMonth = month === 0 && year === 0 && `${diff / (60 * 60 * 24)}天`; // 同月
  const crossMonth =
    date > 0 &&
    date <= 30 &&
    month === 1 &&
    year === 0 &&
    `${diff / (60 * 60 * 24)}天`; // 跨月天
  const crossYear =
    month === 1 &&
    year === 1 &&
    date < 31 &&
    diff / (60 * 60 * 24) < 31 &&
    `${31 - date}天`; // 跨年天: 兼容12月31日 - 1月1日的情况（12月份一定是31天）&& 基本的时间戳差值不能超过
  return sameMonth || crossMonth || crossYear || false;
};
time2string.MONTH = (
  _: number,
  { month, year }: { month: number; year: number }
) => {
  const sameYear = month > 0 && month < 12 && year === 0 && `${month}个月`; // 同年
  const crossYear = month < 12 && year === 1 && `${month}个月`; // 跨年
  return sameYear || crossYear || false;
};
time2string.YEAR = (_: number, { year }: { year: number }) =>
  year > 0 ? `${year}年` : false;

/** 用户全局配置规则的闭包函数 */
time2string.config = (options: OptionsType) => (date: DateType) =>
  time2string(date, options);

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
export function time2string(date: DateType, options: OptionsType = {}): string {
  try {
    let { isNeedSuffix = true, rules, serverTime = new Date() } = options;

    if (!rules) {
      rules = [
        time2string.SEC,
        time2string.MIN,
        time2string.HOUR,
        time2string.DATE,
        time2string.MONTH,
        time2string.YEAR,
      ];
    }

    const baseTimeStamp = time2stamp(date);
    const baseTime = new Date(baseTimeStamp);
    const curTimeStamp = time2stamp(serverTime);
    const curTime = new Date(curTimeStamp);

    let diff = (curTimeStamp - baseTimeStamp) / 1000;
    const suffix = diff < 0 ? "后" : "前";
    diff = Math.abs(diff);

    // 预获取年月日时间差
    const diff_date = Math.abs(curTime.getDate() - baseTime.getDate());
    const diff_month = getMonthBetween(curTime, baseTime);
    const diff_year = Math.abs(curTime.getFullYear() - baseTime.getFullYear());

    let idx = 0;
    let result;

    while (idx < rules.length) {
      result = rules[idx](diff, {
        date: diff_date,
        month: diff_month,
        year: diff_year,
      });
      idx++; // 按顺序执行

      if (Boolean(result)) {
        if (typeof result === "string") {
          const arr = result.match(/\d+(.\d+)?/g); // 小数转整数: 2.xxx月 => 2月
          if (Array.isArray(arr)) {
            const [float] = arr;
            const int = Math.floor(+float);
            result = result.replace(float, String(int));
          }
        }
        break;
      }
    }

    // 容灾方案(灾:计算出来的是 0) & 规则均无满足
    if (!result || (typeof result === "string" && result.startsWith("0"))) {
      result = baseTime.toLocaleDateString();
    } else {
      result = isNeedSuffix ? result + suffix : result;
    }

    return result as string;
  } catch (err) {
    console.error(err);
  }

  return ""; // 返回界面的数据默认值为空比较合理
}
