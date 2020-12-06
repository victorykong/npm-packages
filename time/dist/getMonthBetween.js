export default (date1, date2) => Math.abs((date1.getFullYear() - date2.getFullYear()) * 12 +
    (date1.getMonth() - date2.getMonth()));
