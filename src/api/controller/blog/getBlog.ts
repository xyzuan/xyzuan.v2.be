import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/",
  async () => {
    return {
      status: 200,
      data: await prismaClient.blog
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
        ),
    };
  },
  {
    detail: {
      tags: ["Blog"],
    },
  }
);
