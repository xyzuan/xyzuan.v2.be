import { fileLogger, logger as pinoLogger } from "@bogeychan/elysia-logger";

const logger = fileLogger({
  file: "./my.log",
});

export { logger };
