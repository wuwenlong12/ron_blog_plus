function debounce(
  callback: (...args: any[]) => void,
  time = 200
): (...args: any[]) => void {
  let timer: ReturnType<typeof setTimeout> | null = null; // 兼容浏览器和 Node.js
  return function (this: unknown, ...args: any[]): void {
    if (timer !== null) {
      clearTimeout(timer); // 清除上一个定时器
    }
    timer = setTimeout(() => {
      callback.apply(this, args); // 最后执行的函数
    }, time);
  };
}

export { debounce };
