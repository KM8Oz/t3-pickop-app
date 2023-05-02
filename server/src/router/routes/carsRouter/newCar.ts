import { z, ZodArray, ZodNonEmptyArray, ZodString } from "zod";
import { protectedProcedure } from "../../../trpc/trpc";
import { getMediaObjects, MediaObject } from "../../../utils/mediaparser";
import { CheckUrl } from "../../../utils/regex";
import { uploadImg } from "../../../utils/uploadImg";

export const newCar = protectedProcedure
  .input(
    z.object({
      desc: z.string().min(3).max(250).nonempty(),
      medias: z.array(z.string().nonempty()).nonempty(),
      geo: z.object({
        lat: z.number(),
        long: z.number(),
      }),
      location: z.string().min(3).max(90).nonempty(),
      discount: z.number().negative().max(1000),
      pricePerDay: z.number().positive().max(10000),
      name: z.string().min(3).max(90).nonempty(),
      features: z.array(z.number().nonnegative()).nonempty(),
      tags: z.array(z.string().nonempty()).nonempty()
    })
  )
  .mutation(async ({ ctx, input }) => {
    let medias = await uploadImages(input.medias);
    let isgeo = await ctx.prisma.geo.findFirst({
      where: {
        AND: [
          {
            lat: { equals: input.geo.lat }
          },
          {
            long: { equals: input.geo.long }
          }
        ]
      }
    });
    await ctx.prisma.tag.createMany({
      data: input.tags.map(s => ({ name: s })),
      skipDuplicates: true
    });
    let tags = await ctx.prisma.tag.findMany({
      where: {
        name: { in: input.tags }
      }
    })
    let newCar = await ctx.prisma.car.create({
      data: {
        discount: input.discount,
        location: input.location,
        name: input.name,
        pricePerDay: input.pricePerDay,
        features: {
          connect: input.features.map(s => ({ id: s }))
        },
        ratingcount:0,
        geo: {
          connectOrCreate: {
            create: { ...input.geo, },
            where: {
              id: isgeo?.id!
            }
          }
        },
        medias: {
          createMany: {
            data: medias,
            skipDuplicates: true
          }
        },
        tags: {
          connect: tags
        },
        userId: ctx.session.id
      },
      include: {
        _count: true,
        tags: true,
        medias: true,
        features: true,
        geo: true
      },
    });
    return { success: true, car: newCar };
  });

async function uploadImages(input: Array<string>): Promise<MediaObject[]> {
  let URLS: string[] = [];
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    let imageUrl = "";
    if (element) {
      imageUrl = await uploadImg(element);
      if (imageUrl && CheckUrl(imageUrl)) {
        URLS.push(imageUrl)
      }
    }
  }
  return getMediaObjects(URLS);
}

function limitTextLines(text: string) {
  const newText = text.replace(/(\n{3,})/g, "\n\n");
  return newText;
}