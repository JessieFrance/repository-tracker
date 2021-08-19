/**
 * Check if a date is between a start and end date.
 * @param  {Date}   d     The date to test
 * @param  {Date}   start The start date
 * @param  {Date}   end   The end date
 * @return {boolean}      True if test date within start and end date
 */
const inDateRange = (d: Date, start: Date, end: Date): boolean => {
  return start.getTime() <= d.getTime() && d.getTime() <= end.getTime();
};

interface DataItem {
  created_at: string;
}
/**
 * Filter the last day of data.
 * @param  {DataItem[]} data Array of items with created_at field
 * @return {DataItem[]}      Filtered array that only contains last day's data
 */
export const filterLastDay = (data: DataItem[]): DataItem[] => {
  const now = new Date();
  const backInTime: Date = new Date();
  backInTime.setDate(backInTime.getDate() - 1);

  return data.filter((item) => {
    const itemDate = new Date(item.created_at);
    return inDateRange(itemDate, backInTime, now);
  });
};
