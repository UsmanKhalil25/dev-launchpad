import fs from "fs";
import path from "path";

export function isDirectory(directoryName: string): boolean {
  const directoryPath = path.join(process.cwd(), directoryName);
  return (
    fs.existsSync(directoryPath) && fs.lstatSync(directoryPath).isDirectory()
  );
}

export function isFile(filename: string): boolean {
  const filePath = path.join(process.cwd(), filename);
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory();
}
