# @victorykong/time

* 感谢大家的使用，如果觉得好用，请不要吝啬你的小星星；如果觉得不符合你的需求，请随时提 issue 向我反馈。

## time2stamp
* 任何格式转时间戳

## time2string
### 主要功能：格式化时间显示

* 解决什么问题
	* 例如：2020/11/11、1个月前、1天前、1小时前、1分钟前、30秒前；目前没有一套合适的插件，时间显示不统一，都由后端的返回值决定
	* 或是有一些特殊的逻辑处理，被分散在各个地方，每次都需要开发者手写判断，例如 second > 59 ? '1分钟' : second

```javascript
// 另一种场景：返回时间统计对象
timeObj = {
	second: 10,
	minute: 0,
	hour: 0,
	date: 0,
	month: 0,
	year: '2020/11/11 11:11:11'
}

let txt;
const timeObj = time2string(date);
if (timeObj.second > 59) {
	txt = '1分钟';
}
if (timeObj.minute > 59 * 60) {
	txt = '1小时';
}

// ...

```


### 思路

#### 数据的精确性

* 精准的数据
      * 1秒 = 1000毫秒
      * 1分 = 60秒
      * 1小时 = 60分
      * 1天 = 24小时
      * 1年 = 12个月
* 不精准的数据
      * 1个月 = 30天
      * 1年 = 365天

#### 优先级机制

* 显示优先级我是采取递增的形式，利用 switch...case...break 的特性：` 秒>分>小时>天>月>年`

### FAQ

```
* Q1：怎么定义优先级较好？
* A1：使用范围递增，最先秒，再分钟，以此类推
* A2：两者皆可。只不过前者使用小于比较符，后者使用大于比较符。如果错误搭配，将会导致优先级错误。

* Q3：不绝对精确的数据范围，应如何确定范围？
* A3：得益于递增优先级的实现，如: 当在决定月范围时候，可以直接获取当前时间的月份（年也类似），而不再是两个时间差相减

* Q4：如何做到可以自定义显示格式化后的显示模板？
* A4：参考 moment 库的实现，使用预定义变量占位符的方式，此处使用 %t%
```

