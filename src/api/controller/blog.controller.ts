import { t } from "elysia";

import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { BadRequestException } from "@constants/exceptions";
import { rateLimit } from "elysia-rate-limit";

export const BlogController = createElysia()
  .model({
    "blog.model": t.Object({
      img: t.String(),
      title: t.String(),
      description: t.String(),
      content: t.String(),
      tags: t.Optional(t.String()),
      createdAt: t.Optional(t.Date()),
    }),
    "blog.comment": t.Object({
      content: t.String(),
    }),
    "blog.reaction": t.Object({
      type: t.Enum({
        LIKE: "LIKE",
        LOVE: "LOVE",
        DISLIKE: "DISLIKE",
        WOW: "WOW",
        SAD: "SAD",
        ANGRY: "ANGRY",
      }),
    }),
  })
  .get(
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
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const blog = await prismaClient.blog.findUnique({
        where: {
          id: parseInt(id),
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
  )
  .post(
    "/view/:id",
    async ({ params: { id } }) => {
      return prismaClient.blog.update({
        where: {
          id: parseInt(id),
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    },
    {
      detail: {
        tags: ["Blog"],
      },
    }
  )
  .use(authGuard)
  .use(rateLimit())
  .post(
    "/",
    async ({ body }) => {
      return {
        status: 200,
        data: await prismaClient.blog.create({ data: { ...body } }),
      };
    },
    {
      body: "blog.model",
      detail: {
        tags: ["Blog"],
      },
    }
  )
  .post(
    "/comment/:id",
    async ({ body, params: { id }, user, env }) => {
      const { content } = body;
      const blog = await prismaClient.blog.findUnique({
        where: { id: parseInt(id) },
      });

      if (!blog) {
        throw new BadRequestException("Blog not found.");
      }

      // telegram.sendMessage(
      //   env.TELEGRAM_CHAT_ID,
      //   `@xyzuan\nNew Blog comment from ${user.name}, ${content}\n\nCheck the blog comments in https://xyzuan.my.id/blogs/${blog.id} `,
      //   { parse_mode: "Markdown" }
      // );

      return {
        status: 200,
        data: await prismaClient.blogComment.create({
          data: {
            userId: user.id,
            blogId: blog.id,
            content,
          },
        }),
      };
    },
    {
      body: "blog.comment",
      detail: {
        tags: ["Blog"],
      },
    }
  )
  .post(
    "/reaction/:id",
    async ({ body, params: { id }, user }) => {
      const { type } = body;

      const blog = await prismaClient.blog.findUnique({
        where: { id: parseInt(id) },
      });

      if (!blog) {
        throw new BadRequestException("Blog not found.");
      }

      const existingReaction = await prismaClient.blogReaction.findFirst({
        where: {
          blogId: blog.id,
          userId: user.id,
        },
      });
      if (existingReaction) {
        if (existingReaction.type === type) {
          await prismaClient.blogReaction.delete({
            where: { id: existingReaction.id },
          });
          return {
            status: 200,
            message: "Reaction removed.",
          };
        } else {
          const updatedReaction = await prismaClient.blogReaction.update({
            where: { id: existingReaction.id },
            data: {
              type,
            },
          });
          return {
            status: 200,
            message: "Reaction updated.",
            data: updatedReaction,
          };
        }
      } else {
        const newReaction = await prismaClient.blogReaction.create({
          data: {
            userId: user.id,
            blogId: blog.id,
            type,
          },
        });

        return {
          status: 200,
          message: "Reaction created.",
          data: newReaction,
        };
      }
    },
    {
      body: "blog.reaction",
      detail: {
        tags: ["Blog"],
      },
    }
  );
