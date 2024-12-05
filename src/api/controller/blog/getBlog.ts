import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";

export default createElysia().get(
  "/",
  async () => {
    let blogData;
    const redisBlogData = await redis.get("blog.all");
    if (!redisBlogData) {
      const getAllBlog = await prismaClient.blog
        .findMany({
          include: {
            comments: true,
            reactions: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
        .then((data) =>
          data.map((blog) => ({
            ...blog,
            commentsCount: blog.comments.length,
            reactionsCount: blog.reactions.length,
          }))
        );
      blogData = getAllBlog;
      await redis.set("blog.all", JSON.stringify(getAllBlog));
    } else {
      blogData = JSON.parse(redisBlogData);
    }

    return {
      status: 200,
      data: blogData,
    };
  },
  {
    detail: {
      tags: ["Blog"],
    },
  }
);
