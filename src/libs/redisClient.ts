import { createClient, RedisClientType } from "redis";

const RedisClientConfig: RedisClientType = createClient({
  url: Bun.env.REDIS_URL,
});

export async function initializeRedisClient(): Promise<RedisClientType> {
  RedisClientConfig.on("error", (err: any) =>
    console.log("=> Redis Client Error", err)
  );
  RedisClientConfig.on("connect", () =>
    console.log("=> Redis Client Connected")
  );

  await RedisClientConfig.connect();

  return RedisClientConfig;
}

export { RedisClientConfig as redis };
