import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/:id",
  async ({ params: { id }, set }) => {
    let collectionData;
    const redisCollectionData = await redis.get(`collection.${id}`);
    if (!redisCollectionData) {
      const collection = await prismaClient.collection.findUnique({
        where: { id: parseInt(id) },
      });
      if (!collection) {
        set.status = 404;
        return { status: 404, data: null };
      }
      collectionData = collection;
      await redis.set(`collection.${id}`, JSON.stringify(collection));
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
