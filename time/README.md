# @victorykong/time

- 感谢大家的使用，如果觉得好用，请不要吝啬你的小星星；如果觉得不符合你的需求，请随时提 issue 向我反馈。

## time2stamp

- 任何格式转时间戳

## time2string

### 主要功能：格式化时间显示

- 解决什么问题
- 常常后端返回的数据是具体的时间。如：2020-12-8 14:00:00，前端需要将其显示为：x(秒|分钟|小时|天|月|年)(前|后)
- 另一种实现方案：返回时间统计对象。但该场景不合适，因为每次都需要开发者手写判断

```javascript
timeObj = {
  second: 10,
  minute: 0,
  hour: 0,
  date: 0,
  month: 0,
  year: "2020/11/11 11:11:11",
};

let txt;
const timeObj = time2string(date);
if (timeObj.second > 59) {
  txt = "1分钟";
}
if (timeObj.minute > 59 * 60) {
  txt = "1小时";
}

// ...
```

- 类型说明：

```ts
function time2string(date: DateType, options: OptionsType = {}): string;

type OptionsType = {
  // 规则配置数组，按顺序执行，优先满足规则的将会被返回
  rules?: Array<
    (
      diff: number,
      options: { date: number; month: number; year: number }
    ) => string | false
  >;
  // 后缀：前/后
  isNeedSuffix?: boolean;
  // 基准时间（响应头中的服务器时间）
  serverTime?: DateType;
};
```

- 注意点：

  - 如果你的规则都不满足，将会返回格式：year/month/date

- 简单使用：

```ts
import { time2string } from "@victorykong/time";
time2string("2020-11-11 00:00:00");
```

- 更多场景说明：

  - time2string 函数（对象）上挂载着默认一些默认规则，可以允许你按需配置使用
  - time2string.SEC/MIN/HOUR/DATE/MONTH/YEAR
  - time2string 上还拥有一个 config 方法，允许你指定一次规则，可以多处使用

  ```ts
  const handleTime = time2string.config({
    rules: [
      // 时间戳差值: 1815170.796,
      // 日月年差值: {date: 9, month: 1, year: 0}
      (...args) => {
        console.log(args);
        return "你想要显示的文本";
      },
    ],
    isNeedSuffix: false, // 不需要后缀
    serverTime, // 响应头的时间
  });
  handleTime("xxx");

  // 此处可能省略 n 行代码 ...

  handleTime("xxx"); // 更关心 date 的处理，规则不需要重新进行配置
  ```

### 思路

#### 数据范围的精确性

- 精确的数据

  - 1 秒 = 1000 毫秒
  - 1 分 = 60 秒
  - 1 小时 = 60 分
  - 1 天 = 24 小时
  - 1 周 = 7 天
  - 1 年 = 12 月

- 不精确的数据

  - 1 个月 = 30 天
  - 1 个月 = 4 周
  - 1 年 = 365 天

#### 优先级机制

- 采取递增的形式，`秒>分>小时>天>月>年`

### FAQ

```
* Q1：为什么选择递增，不是递减？
* A1：
	递增更接近真实思维
	规则的范围是由小到大，判断更精确，程序更简易

* Q2：不绝对精确的数据范围，应如何确定范围？
* A2：
	较小范围：时间戳；如：显示×小时：diff < 1天（60*60*24）
	较大范围：获取月、年数；如：显示×天：月份间隔不满 1个月

* Q3：月的间隔是通过相减吗？
* A3：
	公式: (2021 - 2020) * 12 + (5 - 12) = ±5
	得出间隔为 5 个月，并非 Math.abs(5 - 12) 为 7个月
```

### 更新记录

- 1.0.2

  - 1.0.1 最大的问题就是 switch...case 的拓展性为 0
  - 第一个参数 date 不变，第二个参数有所变化，具体可以查看上述的函数类型定义
  - time2string 函数对象维护一套默认规则，可以通过 time2string.SEC ... 获取，具体可以查看例子
  - time2string 函数对象还暴露一个 config 方法，允许用户配置一次，多处使用（类似于全局配置）
  - 解决了函数内部一些边界情况未处理到位的问题，如跨年月，跨年日的处理

- 1.0.1

  - 使用 switch...case...break 实现
  - 支持传递第 2 个参数，自定义显示最终的显示字符串格式（类似于 moment 使用变量 %t% 进行占位）
  - 支持规则延后，例如某个场景下始终不显示 x 天前，而是从 x 月前开始进行显示
