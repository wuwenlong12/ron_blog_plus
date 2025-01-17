export function setRem(): void {
  const baseWidth = 375; // 设计稿基准宽度
  const baseFontSize = 16; // 设计稿中1rem的像素值
  const minFontSize = 12; // 最小字体大小限制
  const minWidth = 375; // 设置最小宽度阈值
  const clientWidth = document.documentElement.clientWidth;

  // 如果屏幕宽度小于350px，字体大小不再继续缩小
  if (clientWidth < minWidth) {
    document.documentElement.style.fontSize = `${minFontSize}px`;
    return;
  }

  const scale = clientWidth / baseWidth;

  // 计算根字体大小，限制最大缩放比例为2倍，同时限制最小根字体大小
  const fontSize = Math.max(baseFontSize * Math.min(scale, 1), minFontSize);
  console.log("窗口大小变化了！" + fontSize);
  // 设置根元素的字体大小
  document.documentElement.style.fontSize = `${fontSize}px`;
}

// 防抖函数，避免频繁触发
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait = 100
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return function (this: unknown, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

// 监听窗口变化，添加防抖
window.addEventListener("resize", debounce(setRem));

// 页面加载时执行一次
setRem();
