import fs from "fs/promises";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);

    // create parser instance
    const parser = new PDFParse({ data: dataBuffer });

    // extract text
    const data = await parser.getText();

    return {
      text: data.text,
      numPages: data.total,
      info: data.info
    };

  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};