import winston from "winston";
import moment from "moment";
require("winston-daily-rotate-file");

class BaseWriter {
  constructor(transports) {
    this.logger = winston.createLogger({
      transports: transports,
    });
  }

  error(message, ...options) {
    if (message instanceof Error) {
      this.logger.error(`[${moment().format()}]: ${message.stack}`, ...options);
    } else if (typeof message === "object") {
      this.logger.error(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.error(`[${moment().format()}]: ${message}`, ...options);
    }
  }

  warn(message, ...options) {
    if (typeof message === "object") {
      this.logger.warn(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.warn(`[${moment().format()}]: ${message}`, ...options);
    }
  }

  debug(message, ...options) {
    if (typeof message === "object") {
      this.logger.debug(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.debug(`[${moment().format()}]: ${message}`, ...options);
    }
  }

  verbose(message, ...options) {
    if (typeof message === "object") {
      this.logger.verbose(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.verbose(`[${moment().format()}]: ${message}`, ...options);
    }
  }

  info(message, ...options) {
    if (typeof message === "object") {
      this.logger.info(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.info(`[${moment().format()}]: ${message}`, ...options);
    }
  }

  silly(message, ...options) {
    if (typeof message === "object") {
      this.logger.silly(
        `[${moment().format()}]: ${JSON.stringify(message)}`,
        ...options
      );
    } else {
      this.logger.silly(`[${moment().format()}]: ${message}`, ...options);
    }
  }
}

module.exports = BaseWriter;
