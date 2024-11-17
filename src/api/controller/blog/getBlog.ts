import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async ({ redis }) => {
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
      await redis.set("blog.all", JSON.stringify(getAllBlog), 1440);
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