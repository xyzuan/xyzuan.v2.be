import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";
import { BadRequestException } from "@constants/exceptions";
import { rateLimit } from "elysia-rate-limit";
import { createElysia } from "@libs/elysia";
import blogModel from "@models/blog.model";

export default createElysia()
  .use(blogModel)
  .use(authGuard)
  .use(
    rateLimit({
      max: 3,
      duration: 60000,
    })
  )
  .post(
    "/comment/:id",
    async ({ body, params: { id }, user }) => {
      const { content } = body;
      const blog = await prismaClient.blog.findUnique({
        where: { id: parseInt(id) },
      });

      if (!blog) {
        throw new BadRequestException("Blog not found.");
      }

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
  );
