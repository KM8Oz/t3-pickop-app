import { z } from "zod";
import { protectedProcedure } from "../../../trpc/trpc";

export const followUser = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    const existingFollow = await ctx.prisma.follow.findFirst({
      where: {
        AND: [
          { followerId: { equals: ctx.session.id } },
          { followingId: { equals: input.id } },
        ],
      },
    });
    let updatedUser;

    if (!existingFollow) {
      // User is not following, add new row in UserFollow and increment following count of the user and increment the followers count of the other user
      let createRecord = await ctx.prisma.follow.create({
        data: {
          followingId: ctx.session.id,
          followerId: input.id,
        },
      });
      updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.id },
        data: {
          followingCount: {
            increment: 1,
          },
        },
        include: {
          "followers": true,
        },
      });
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      });
    } else {
      // User is already following, remove the row and decrement both
      let deleteRecord = await ctx.prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.id },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      });
      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      });
    }
    return { success: true };
  });
