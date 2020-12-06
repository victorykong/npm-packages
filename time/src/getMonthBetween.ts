export default (date1: Date, date2: Date) =>
  Math.abs(
    (date1.getFullYear() - date2.getFullYear()) * 12 +
      (date1.getMonth() - date2.getMonth())
  );
