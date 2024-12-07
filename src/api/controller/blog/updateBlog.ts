import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import { redis } from "@libs/redisClient";
import blogModel from "@models/blog.model";

export default createElysia()
  .use(blogModel)
  .use(authGuard)
  .patch(
    "/:id",
    async ({ body, params: { id }, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      const blog = await prismaClient.blog.update({
        where: { id: parseInt(id) },
        data: { ...body },
      });
      await redis.del(`blog.${blog.slug}`);
      await redis.del(`blog.all`);
      return {
        status: 200,
        message: "Blog updated successfully",
      };
    },
    {
      body: "blog.patch.model",
      detail: {
        tags: ["Blog"],
      },
    }
  );
