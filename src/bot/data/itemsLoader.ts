import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "items.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const items = JSON.parse(rawData);

type ItemsType = {
  LocalizationNameVariable: string;
  LocalizationDescriptionVariable: string;
  LocalizedNames: Record<string, string>;
  LocalizedDescriptions: Record<string, string>;
  Index: string;
  UniqueName: string;
};

export default items as ItemsType[];
