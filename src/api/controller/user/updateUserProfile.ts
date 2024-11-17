import { authGuard } from "@libs/authGuard";
import { createElysia } from "@libs/elysia";
import { prismaClient } from "@libs/prismaDatabase";
import userModel from "@models/user.model";

export default createElysia()
  .use(userModel)
  .use(authGuard)
  .patch(
    "/",
    async ({ body, user }) => {
      let updatedData: any = body;
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...updatedData,
        },
      });

      return {
        status: 200,
        data: {
          message: "Profile Updated",
        },
      };
    },
    {
      detail: {
        tags: ["Users"],
      },
      body: "user.model",
    }
  );
