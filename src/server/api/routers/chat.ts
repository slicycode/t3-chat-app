import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return { greeting: `Hello ${input?.text ?? "world"}` };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  conversations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.conversationUser.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        conversation: {
          include: {
            conversationUsers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    username: true,
                  },
                },
              },
            },
            lastMessage: true,
          },
        },
      },
      orderBy: {
        conversation: {
          lastMessageId: "desc",
        },
      },
    });
  }),
  findConversation: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input: { userId }, ctx }) => {
      //U1 conversations: [c1, c2]
      //U2 conversations: [c1]
      //[(c1:u2, c1:u1), (c2:u1)]
      const conversationUsers = await ctx.prisma.conversationUser.groupBy({
        by: ["conversationId"],
        where: {
          userId: {
            in: [userId, ctx.session.user.id],
          },
        },
        having: {
          userId: {
            _count: {
              equals: 2,
            },
          },
        },
      });

      return conversationUsers.length
        ? conversationUsers[0]?.conversationId
        : null;
    }),
  messages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input: { conversationId }, ctx }) => {
      await ctx.prisma.conversationUser.findUniqueOrThrow({
        where: {
          userId_conversationId: {
            userId: ctx.session.user.id,
            conversationId,
          },
        },
      });
      return ctx.prisma.message.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          id: "asc",
        },
      });
    }),
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().nullish(),
        messageText: z.string(),
        userId: z.string().nullish(),
      })
    )
    .mutation(
      async ({ input: { messageText, conversationId, userId }, ctx }) => {
        if (!conversationId) {
          if (!userId) {
            throw new Error("No recipient passed");
          }

          return ctx.prisma.$transaction(async (trx) => {
            const conversation = await trx.conversations.create({
              data: {
                messages: {
                  create: {
                    messageText,
                    userId: ctx.session.user.id,
                  },
                },
                conversationUsers: {
                  createMany: {
                    data: [{ userId }, { userId: ctx.session.user.id }],
                  },
                },
              },
              include: {
                messages: true,
              },
            });

            await trx.conversations.update({
              data: {
                lastMessageId: conversation.messages[0]!.id,
              },
              where: {
                id: conversation.id,
              },
            });
          });
        }

        await ctx.prisma.$transaction(async (trx) => {
          const [message] = await Promise.all([
            trx.message.create({
              data: {
                messageText,
                userId: ctx.session.user.id,
                conversationId,
              },
            }),
            trx.conversationUser.findUniqueOrThrow({
              where: {
                userId_conversationId: {
                  userId: ctx.session.user.id,
                  conversationId,
                },
              },
            }),
          ]);

          await trx.conversations.update({
            data: {
              lastMessageId: message.id,
            },
            where: {
              id: conversationId,
            },
          });
        });
      }
    ),
  // onSendMessage: protectedProcedure.subscription(({ ctx }) => {
  //   return observable<{ conversationId: string }>((emit) => {
  //     const onSendMessage = (data: {
  //       conversationId: string;
  //       userId: string;
  //     }) => {
  //       if (data.userId === ctx.session.user.id) {
  //         emit.next({ conversationId: data.conversationId });
  //       }
  //     };
  //     ctx.ee.on("sendMessage", onSendMessage);

  //     return () => {
  //       ctx.ee.off("sendMessage", onSendMessage);
  //     };
  //   });
  // }),
});
