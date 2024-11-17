import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:slug",
  async ({ params: { slug }, redis }) => {
    let blogData;
    const redisBlogData = await redis.get(`blog.${slug}`);
    if (!redisBlogData) {
      const blog = await prismaClient.blog.findUnique({
        where: {
          slug: slug,
        },
        include: {
          reactions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  iconUrl: true,
                },
              },
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  iconUrl: true,
                  bannerUrl: true,
                  location: true,
                  headline: true,
                  isAdmin: true,
                },
              },
            },
          },
        },
      });
      blogData = blog;
      await redis.set(`blog.${slug}`, JSON.stringify(blog), 1440);
    } else {
      blogData = JSON.parse(redisBlogData);
    }

    if (!blogData) {
      return {
        status: 404,
        message: "Blog not found.",
      };
    }

    return {
      status: 200,
      data: {
        ...blogData,
        commentsCount: blogData.comments.length,
        reactionsCount: blogData.reactions.length,
      },
    };
  },
  {
    detail: {
      tags: ["Blog"],
    },
  }
);
