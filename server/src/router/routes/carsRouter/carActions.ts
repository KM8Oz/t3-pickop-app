import { z } from "zod";
import { protectedProcedure } from "../../../trpc/trpc";

export const likeCar = protectedProcedure
  .input(z.object({ id: z.number().nullish() }))
  .mutation(async ({ ctx, input }) => {
    const existingLike = await ctx.prisma.like.findFirst({
      where: {
        likerId: ctx.session.id,
        likedId: Number(input.id)!,
      },
    });
    let updatedLike;

    if (!existingLike) {
      updatedLike = await ctx.prisma.car.update({
        where: { id: input.id! },
        data: {
          likecount: { increment: 1 },
          favoredby: {
            create: {
              liker: {
                connect: {
                  id: ctx.session.id
                }
              },
            }
          },
        },
        include: {
          _count: true,
          favoredby: { select: { updatedAt: true } }
        },
      });
    } else {
      updatedLike = await ctx.prisma.car.update({
        where: { id: input.id! },
        data: {
          likecount: { decrement: 1 },
          favoredby: {
            delete: {
              id: existingLike.id,
            },
          },
        },
        include: {
          _count: true,
          favoredby: { select: { updatedAt: true } }
        },
      });
    }
    return { success: true };
  });

export const rateCar = protectedProcedure
  .input(z.object({ id: z.number().nullish(), body: z.string().min(1), rating: z.number().max(5).min(1) }))
  .mutation(async ({ ctx, input }) => {
    const [reply, car] = await ctx.prisma.$transaction([
      ctx.prisma.rating.create({
        data: {
          text: input.body,
          reviewer: { connect: { id: ctx.session.id } },
          car: { connect: { id: input.id! } },
          rating: input.rating!
        },
        include: { reviewer: true },
      }),
      ctx.prisma.car.update({
        where: { id: input.id! },
        data: { ratingcount: { increment: 1 } },
      }),
    ]);
    return { success: true, reply };
  });
