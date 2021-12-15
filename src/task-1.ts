import { stdin } from "process";

const revertText = (text: string) => text.split("").reverse().join("");

const runTask = () =>
  stdin
    .on("data", (dataBuffer) => console.log(revertText(dataBuffer.toString())))
    .on("error", (error) => console.log(error));

runTask();
