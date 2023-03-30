import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  changeUserData: protectedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        username: z.string().nullish(),
        image: z.string().nullish(),
      })
    )
    .mutation(({ input: { username, name, image }, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name,
          username,
          image,
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
  changeUserTheme: protectedProcedure
    .input(z.object({ theme: z.enum(["light", "dark"]) }))
    .mutation(({ input: { theme }, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          theme,
        },
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          theme: true,
        },
      });
    }),
  users: protectedProcedure
    .input(z.object({ user: z.string() }))
    .query(({ input: { user }, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: user,
                mode: "insensitive",
              },
              username: {
                contains: user,
                mode: "insensitive",
              },
            },
          ],
          NOT: { id: ctx.session.user.id },
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
});
