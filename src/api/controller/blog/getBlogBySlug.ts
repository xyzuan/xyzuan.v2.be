import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";

export default createElysia().get(
  "/:slug",
  async ({ params: { slug } }) => {
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

    if (!blog) {
      return {
        status: 404,
        message: "Blog not found.",
      };
    }

    return {
      status: 200,
      data: {
        ...blog,
        commentsCount: blog.comments.length,
        reactionsCount: blog.reactions.length,
      },
    };
  },
  {
    detail: {
      tags: ["Blog"],
    },
  }
);
