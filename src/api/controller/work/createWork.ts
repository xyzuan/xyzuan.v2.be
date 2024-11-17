import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import workModel from "@models/work.model";

export default createElysia()
  .use(workModel)
  .use(authGuard)
  .post(
    "/",
    async ({ body, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      return await prismaClient.work.create({
        data: {
          ...body,
          responsibilities: {
            create: body.responsibilities.map((description: string) => ({
              description,
            })),
          },
        },
        select: {
          id: true,
          logo: true,
          jobTitle: true,
          address: true,
          instance: true,
          instanceLink: true,
          date: true,
          responsibilities: {
            select: {
              id: true,
              description: true,
            },
          },
        },
      });
    },
    {
      detail: {
        tags: ["Works"],
      },
      body: "work.model",
      response: "work.model.response",
    }
  );
