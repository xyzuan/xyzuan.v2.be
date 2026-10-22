import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";
import { version } from "@utils/version";

const SERVICE_PING_TIMEOUT_MS = 2000;

type ServiceStatus = {
  status: "up" | "down";
  latencyMs?: number;
  error?: string;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)
    ),
  ]);
}

async function pingPostgres(): Promise<ServiceStatus> {
  const start = performance.now();
  try {
    await withTimeout(prismaClient.$queryRaw`SELECT 1`, SERVICE_PING_TIMEOUT_MS);
    return { status: "up", latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return {
      status: "down",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

async function pingRedis(): Promise<ServiceStatus> {
  if (!redis.isOpen) {
    return { status: "down", error: "connection not open" };
  }
  const start = performance.now();
  try {
    await withTimeout(redis.ping(), SERVICE_PING_TIMEOUT_MS);
    return { status: "up", latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return {
      status: "down",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

export default createElysia().get(
  "/",
  async ({ set }) => {
    const [postgres, redisStatus] = await Promise.all([
      pingPostgres(),
      pingRedis(),
    ]);

    const anyDown = postgres.status === "down" || redisStatus.status === "down";
    const overall = anyDown ? "degraded" : "ok";

    set.status = anyDown ? 503 : 200;

    return {
      status: overall,
      version: version.app,
      commit: version.commit,
      runtime: version.runtime,
      services: {
        postgres,
        redis: redisStatus,
      },
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  },
  {
    detail: {
      tags: ["Health"],
      summary: "Service health & version",
      description:
        "Returns service health (Postgres, Redis), app version, git commit, runtime, and uptime. Responds 503 when any dependency is down.",
    },
  }
);
