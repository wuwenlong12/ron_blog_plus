function formatTimestampToDay(timestamp: Date | undefined) {
  if (timestamp === undefined) return null;
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始，需要加1
  const day = date.getDate();

  // 格式化为 `YYYY年M月D日 HH:mm`
  return `${year}年${month}月${day}日 `;
}

function formatTimestampToFullDateTime(timestamp: Date | undefined): string {
  if (!timestamp) return "查询具体时间失败";
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 格式化为 `YYYY年MM月DD日 HH:mm:ss`
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
}

function formatTimestampToTime(timestamp: Date | undefined) {
  if (timestamp === undefined) return "查询具体时间失败";
  return new Date(timestamp).toString();
}

export {
  formatTimestampToDay,
  formatTimestampToTime,
  formatTimestampToFullDateTime,
};
