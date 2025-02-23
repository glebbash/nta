import * as fs from "node:fs/promises";
import { marked } from "marked";
import * as cheerio from "cheerio";

const ctx = {
  inputFileName: "",
  inputMd: "",
  fileNameToIdMapping: new Map<string, string>(),
  extractedDocs: {} as Record<
    string,
    { meta: Record<string, unknown>; content: string }
  >,
};
type ProcessingCtx = typeof ctx;

await main();

async function main() {
  const baseDir = "./tmp/md";
  const fileNames = await fs.readdir(baseDir);

  for (const fileName of fileNames) {
    if (fileName === "files" || fileName.endsWith(".zip")) {
      continue;
    }

    ctx.inputFileName = fileName;
    ctx.inputMd = await fs.readFile(baseDir + "/" + fileName, "utf8");
    await processDoc(ctx);
  }

  await fs.writeFile(
    "./tmp/out.json",
    JSON.stringify(ctx.extractedDocs, null, 2)
  );
}

async function processDoc(ctx: ProcessingCtx) {
  if (!ctx.fileNameToIdMapping.has(ctx.inputFileName)) {
    ctx.fileNameToIdMapping.set(ctx.inputFileName, crypto.randomUUID());
  }

  const docId = ctx.fileNameToIdMapping.get(ctx.inputFileName)!;

  const inputHtml = await marked(ctx.inputMd);
  const $ = cheerio.load(inputHtml);

  const docTitle = $("h1").first().text();
  $("h1").first().remove();

  $("a").each((_, link) => {
    const href = $(link).attr("href");
    if (
      !href ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      !href.endsWith(".md")
    ) {
      return;
    }

    if (!ctx.fileNameToIdMapping.has(href)) {
      ctx.fileNameToIdMapping.set(href, crypto.randomUUID());
    }

    $(link).attr("href", `note:${ctx.fileNameToIdMapping.get(href)}`);
  });

  const docHtml = $("body").html()?.trim() ?? "";

  ctx.extractedDocs[docId] = {
    meta: { title: docTitle },
    content: docHtml,
  };
}
