import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";
import { BadRequestException } from "@constants/exceptions";
import { createElysia } from "@libs/elysia";
import blogModel from "@models/blog.model";

export default createElysia()
  .use(blogModel)
  .use(authGuard)
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
