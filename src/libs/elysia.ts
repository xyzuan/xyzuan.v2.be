import { env } from "@libs/env";
import { error } from "@utils/errorHandler";
import { Elysia, type ElysiaConfig } from "elysia";
import logger from "./logger";
import telemetry from "./telemetry";

const baseElysia = <
  const BasePath extends string = "",
  const Scoped extends boolean = false
>(
  config?: ElysiaConfig<BasePath, Scoped>
) => new Elysia(config).use(env).use(logger).use(telemetry).use(error);

const createElysia = (config?: Parameters<typeof baseElysia>[0]) =>
  new Elysia(config) as ReturnType<typeof baseElysia>;

export { createElysia, baseElysia };
