function formatTimestampToDay(timestamp: Date | undefined) {
  if (timestamp === undefined) return null;
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 格式化为 `YYYY年M月D日 HH:mm`
  return `${year}年${month}月${day}日 `;
}

function formatTimestampToTime(timestamp: Date | undefined) {
  if (timestamp === undefined) return "查询具体时间失败";
  return new Date(timestamp).toString();
}

export { formatTimestampToDay, formatTimestampToTime };
