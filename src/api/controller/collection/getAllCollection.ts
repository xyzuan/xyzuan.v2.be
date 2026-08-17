import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/",
  async () => {
    let collectionData;
    const redisCollectionData = await redis.get(`collection.all`);
    if (!redisCollectionData) {
      const collection = await prismaClient.collection.findMany({
        orderBy: [
          {
            isFeatured: "desc",
          },
          {
            id: "desc",
          },
        ],
      });
      collectionData = collection;
      await redis.set("collection.all", JSON.stringify(collection));
    } else {
      collectionData = JSON.parse(redisCollectionData);
    }
    return {
      status: 200,
      data: collectionData,
    };
  },
  {
    detail: {
      tags: ["Collections"],
    },
  }
);
