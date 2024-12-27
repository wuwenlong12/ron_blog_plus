function downloadMarkdown(markdownContent: string, filename = "document.md") {
  // 创建一个 Blob 对象，指定文件类型为 text/markdown
  const blob = new Blob([markdownContent], { type: "text/markdown" });

  // 创建一个指向 Blob 对象的 URL
  const url = URL.createObjectURL(blob);

  // 创建一个临时的 <a> 标签用于下载
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 设置下载文件的名称（可以自定义）

  // 触发点击事件，下载文件
  document.body.appendChild(a);
  a.click();

  // 下载完成后，清理临时创建的链接
  document.body.removeChild(a);

  // 释放 URL 对象
  URL.revokeObjectURL(url);
}

export { downloadMarkdown };
