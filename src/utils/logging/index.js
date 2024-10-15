import { InvalidInputError } from "../errors/index";
import { ConsoleWriter } from "./writers";

class Logger {
  /**
   *
   * @param {[*]} writers - an array of writers
   */
  constructor(writers) {
    if (!writers || !writers.length) {
      throw new InvalidInputError("writers must be an non-empty array.");
    }
    this.writers = writers;
  }

  info(message, ...options) {
    this.writers.map((writer) => {
      writer.info(message, options);
    });
  }

  error(message, ...options) {
    this.writers.map((writer) => {
      writer.error(message, options);
    });
  }

  warn(message, ...options) {
    this.writers.map((writer) => {
      writer.warn(message, options);
    });
  }

  verbose(message, ...options) {
    this.writers.map((writer) => {
      writer.verbose(message, options);
    });
  }

  debug(message, ...options) {
    this.writers.map((writer) => {
      writer.debug(message, options);
    });
  }

  silly(message, ...options) {
    this.writers.map((writer) => {
      writer.silly(message, options);
    });
  }
}

const writers = [];

writers.push(new ConsoleWriter());

module.exports = new Logger(writers);
