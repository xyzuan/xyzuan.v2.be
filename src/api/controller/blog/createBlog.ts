import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import slugify from "@utils/slugUtils";
import blogModel from "@models/blog.model";

export default createElysia()
  .use(blogModel)
  .use(authGuard)
  .post(
    "/",
    async ({ body, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();
      return {
        status: 200,
        data: await prismaClient.blog.create({
          data: {
            ...body,
            slug: slugify(body.title),
          },
        }),
      };
    },
    {
      body: "blog.model",
      detail: {
        tags: ["Blog"],
      },
    }
  );
