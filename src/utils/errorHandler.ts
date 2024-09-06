import Elysia from "elysia";
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import { logger } from "@libs/logger";

/**
 * 400 - Bad Request
 * BadRequestException
 *
 * 401 - Unauthorized
 * UnauthorizedException
 *
 * 403 - Forbidden
 * ForbiddenException
 *
 * 404 - Not Found
 * NotFoundException
 *
 * 405 - Method Not Allowed
 * MethodNotAllowedException
 *
 * 409 - Conflict
 * ConflictException
 *
 * 418 - I'm a teapot
 * ImATeapotException
 *
 * 500 - Internal Server Error
 * InternalServerErrorException
 *
 * 501 - Not Implemented
 * NotImplementedException
 *
 * 502 - Bad Gateway
 * BadGatewayException
 *
 * 503 - Service Unavailable
 * ServiceUnavailableException
 */

const error = new Elysia()
  .use(logger)
  .error({
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ImATeapotException,
    InternalServerErrorException,
    MethodNotAllowedException,
    NotFoundException,
    NotImplementedException,
    ServiceUnavailableException,
    UnauthorizedException,
  })
  .onError({ as: "global" }, (ctx) => {
    const { code, error, log } = ctx;

    switch (code) {
      case "NOT_FOUND":
        return new NotFoundException();
      case "INTERNAL_SERVER_ERROR":
        if (log) {
          log.error({
            code,
            error,
          });
        } else {
          console.error("Log is undefined. Error: ", { code, error });
        }
        return new InternalServerErrorException();
      default:
        if (log) {
          log.error({
            code,
            error,
          });
        } else {
          console.error("Log is undefined. Error: ", { code, error });
        }
        return error;
    }
  });

export { error };
