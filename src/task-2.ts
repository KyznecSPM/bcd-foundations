import csv from "csvtojson";
import fs from "fs";
import path from "path";
import { pipeline, Transform } from "stream";

const DELAY = 1500;

const INPUT_FILE_PATH = path.join("..", "csv", "file.csv");
const OUTPUT_FILE_PATH = path.join("..", "output", "file.txt");

const EXCLUDE_COLUMNS = ["Amount"];

const readStream = fs.createReadStream(
  path.resolve(__dirname, INPUT_FILE_PATH)
);

const writeToFileStream = fs.createWriteStream(
  path.resolve(__dirname, OUTPUT_FILE_PATH)
);

const writeToDatabase = new Transform({
  transform(chunk, encoding, callback) {
    new Promise((resolve) => setTimeout(resolve, DELAY)).then(() => {
      console.log("Write to DB", chunk.toString());
      callback();
    });
  },
});

const log = (name: string) => (err: NodeJS.ErrnoException | null) => {
  if (err) {
    console.error(`Pipeline ${name} failed.\n`, err);
  } else {
    console.log(`Pipeline ${name} succeed.\n`);
  }
};

const readCsv = csv()
  .fromStream(readStream)
  .subscribe((csvLine) => {
    return new Promise((resolve) => {
      EXCLUDE_COLUMNS.forEach(
        (columnName) => (csvLine[columnName] = undefined)
      );
      resolve();
    });
  });

pipeline(readCsv, writeToFileStream, log("write to file"));
pipeline(readCsv, writeToDatabase, log("write to database"));
