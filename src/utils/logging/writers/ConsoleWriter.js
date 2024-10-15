import BaseWriter from "./BaseWriter";
import winston from "winston";
require("winston-daily-rotate-file");

class ConsoleWriter extends BaseWriter {
  constructor() {
    super([
      new winston.transports.Console({ format: winston.format.simple() }),
    ]);
  }
}

module.exports = ConsoleWriter;
