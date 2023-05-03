import fs from "fs";
import Helper from "./helper.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function DataImporter(caseData, settings = {}) {
  try {
    const helper = new Helper(settings);
    
    console.log("Started writing");
    await helper.executeList(caseData);
    console.log("Finished writing");
  } catch (error) {
    console.error(error);
  }
}

export default async function CasePathImporter(casePath = "", settings = {}) {
  try {
    const path = __dirname + "\\cases\\" + casePath.replace(/\//g, "\\", "/g") + ".json";
    if (!fs.existsSync(path) || fs.lstatSync(path).isDirectory()) {
      console.error("\n\nCase does not exist: " + path);
      return;
    }
    const caseData = JSON.parse(fs.readFileSync(path, "utf8"));
    const helper = new Helper(settings);

    console.log("Started writing\n");
    await helper.executeList(caseData);
    console.log("\nFinished writing");
  } catch (error) {
    console.error(error);
  }
}