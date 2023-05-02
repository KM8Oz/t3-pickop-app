import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../../../trpc/trpc";
import _ from "lodash";
import { TO_REMOVE } from "../../../utils/TO_REMOVE";
import { removeProperties } from "../../../utils/removeProperties";

export const getCars = protectedProcedure
  .input(z.object({ skip: z.number().nullish() }))
  .mutation(async ({ ctx, input }) => {
    const pageSize = 10;
    let cars = await ctx.prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        favoredby: true,
        medias: true,
        features: true,
        geo: true,
        Order: true,
        ratings: true,
        tags: true,
        User: true
      },
      take: pageSize + 1, // fetch one more tweet than needed
      skip: input.skip || 0,
    });
    const hasMore = cars.length > pageSize;
    if (hasMore) {
      cars.pop();
    }
    return { success: true, tweets: removeProperties(cars), hasMore };
  });
export const getCar = publicProcedure
  .input(z.object({ id: z.number().nullish() }))
  .query(async ({ ctx, input }) => {
    let car = await ctx.prisma.car.findUnique({
      where: { id: input.id! },
      include: {
        User: true,
        favoredby: true,
        medias: true,
        features: true,
        geo: true,
        Order: true,
        ratings: true,
        tags: true,
      },
    });
    return { success: true, car: removeProperties(car) };
  });
