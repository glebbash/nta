export function saveLocalFile(fileName: string, data: unknown) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

  const download = document.createElement("a");
  download.setAttribute("href", dataStr);
  download.setAttribute("download", fileName);
  document.body.appendChild(download);
  download.click();
  download.remove();
}

export function selectLocalFile(contentType: string): Promise<File> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = contentType;

    input.onchange = () => {
      resolve(input.files![0]);
    };

    input.click();
  });
}
