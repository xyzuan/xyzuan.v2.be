import { createElysia } from "@libs/elysia";
import { t } from "elysia";
import { authGuard } from "@libs/authGuard";
import { prismaClient } from "@libs/prismaDatabase";
import { UnauthorizedException } from "@constants/exceptions";
import { rateLimit } from "elysia-rate-limit";
import { telegram } from "@libs/telegram";

export const MessageController = createElysia()
  .get(
    "/",
    async () => {
      return {
        status: 200,
        data: await prismaClient.message.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                iconUrl: true,
                isAdmin: true,
              },
            },
            mentionedBy: true,
            mentionedTo: {
              select: {
                id: true,
                message: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        }),
      };
    },
    {
      detail: {
        tags: ["Messages"],
      },
    }
  )
  .use(authGuard)
  .ws("/", {
    body: t.Object({
      action: t.Enum({
        CREATE: "CREATE",
        DELETE: "DELETE",
      }),
      message: t.Optional(t.String()),
      messageId: t.Optional(t.String()),
      messageMentionId: t.Optional(t.String()),
    }),
    detail: {
      tags: ["Messages"],
    },
    open(ws) {
      ws.subscribe("message");
    },
    async message(ws, body) {
      const { user } = ws.data;
      const { action, message, messageId, messageMentionId } = body;

      try {
        if (action === "CREATE" || action === "DELETE") {
          if (!user) {
            return ws.publish(
              "message",
              JSON.stringify({
                status: 401,
                error: "Unauthorized",
              })
            );
          }
          if (action === "CREATE") {
            let mentionedMessage = null;

            if (messageMentionId) {
              mentionedMessage = await prismaClient.message.findUnique({
                where: { id: messageMentionId },
              });

              if (!mentionedMessage) {
                return ws.publish(
                  "message",
                  JSON.stringify({
                    status: 404,
                    error: `Message with ID ${messageMentionId} not found`,
                  })
                );
              }
            }

            if (!message) {
              return ws.publish(
                "message",
                JSON.stringify({
                  status: 404,
                  error: `Message content needed`,
                })
              );
            }

            const createdMessage = await prismaClient.message.create({
              data: {
                message,
                mentionedTo: messageMentionId
                  ? { connect: { id: messageMentionId } }
                  : undefined,
                user: { connect: { id: user.id } },
              },
              include: {
                user: true,
              },
            });

            ws.publish("message", JSON.stringify(createdMessage));
          } else if (action === "DELETE") {
            if (!messageId) {
              return ws.publish(
                "message",
                JSON.stringify({
                  status: 400,
                  error: "Message ID is required for deletion",
                })
              );
            }

            const messageToDelete = await prismaClient.message.findUnique({
              where: { id: messageId },
            });

            if (!messageToDelete) {
              return ws.publish(
                "message",
                JSON.stringify({
                  status: 404,
                  error: `Message with ID ${messageId} not found`,
                })
              );
            }

            if (messageToDelete.userId !== user.id && !user.isAdmin) {
              throw new UnauthorizedException();
            }

            await prismaClient.message.delete({
              where: { id: messageId },
            });

            ws.publish(
              "message",
              JSON.stringify({ deletedMessageId: messageId })
            );
          }
        }
      } catch (e) {
        console.error(e);
        ws.publish(
          "message",
          JSON.stringify({
            status: 500,
            error: "Internal server error",
          })
        );
      }
    },
  });
