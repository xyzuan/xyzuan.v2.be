import { ForbiddenException } from "@constants/exceptions";
import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import workModel from "@models/work.model";

export default createElysia()
  .use(workModel)
  .use(authGuard)
  .patch(
    "/:id",
    async ({ params: { id }, body, user }) => {
      if (!user.isAdmin) throw new ForbiddenException();

      let updatedData: any = { ...body };

      if (body.responsibilities) {
        updatedData.responsibilities = {
          deleteMany: {},
          create: body.responsibilities.map((description) => ({
            description,
          })),
        };
      }
      await prismaClient.work.update({
        where: { id: parseInt(id) },
        data: { ...updatedData },
        include: {
          responsibilities: true,
        },
      });
      return {
        status: 200,
        message: "Work and related responsibilities updated successfully",
      };
    },
    {
      body: "work.model",
      detail: {
        tags: ["Works"],
      },
    }
  );
