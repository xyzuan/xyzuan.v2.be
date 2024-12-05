import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/",
  async () => {
    let workData;
    const redisWorkData = await redis.get(`work.all`);
    if (!redisWorkData) {
      const work = await prismaClient.work.findMany({
        include: {
          responsibilities: true,
        },
      });
      workData = work;
      await redis.set(`work.all`, JSON.stringify(work));
    } else {
      workData = JSON.parse(redisWorkData);
    }
    return {
      status: 200,
      data: workData,
    };
  },
  {
    detail: {
      tags: ["Works"],
    },
  }
);
