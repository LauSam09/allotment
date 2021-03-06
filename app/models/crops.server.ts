import type { Crop, Prisma, Sowing, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Crop } from "@prisma/client";

export type CropWithSowingsAndSpecies = Prisma.CropGetPayload<{
  include: { sowings: true; species: true };
}>;

export enum CropStage {
  Growing = "growing",
  Finished = "finished",
}

export function getCrop({
  id,
  userId,
}: Pick<Crop, "id"> & { userId: User["id"] }) {
  return prisma.crop.findFirst({
    include: { sowings: true, species: true },
    where: { id, userId },
  });
}

export function getCropListItems({ userId }: { userId: User["id"] }) {
  return prisma.crop.findMany({
    where: { userId },
    select: { id: true, species: true },
  });
}

export function createCrop({
  speciesId,
  userId,
}: Pick<Crop, "speciesId"> & { userId: User["id"] }) {
  return prisma.crop.create({
    data: {
      species: {
        connect: {
          id: speciesId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteCrop({
  id,
  userId,
}: Pick<Crop, "id"> & { userId: User["id"] }) {
  return prisma.crop.deleteMany({
    where: { id, userId },
  });
}

export function createSowing({
  id,
  plantedAt,
}: Pick<Crop, "id"> & Pick<Sowing, "plantedAt">) {
  return prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt,
      crop: {
        connect: {
          id,
        },
      },
    },
  });
}

// TODO: require userId as well.
export function deleteSowing({
  id,
  cropId,
}: Pick<Sowing, "id"> & { cropId: Crop["id"] }) {
  return prisma.sowing.deleteMany({
    where: {
      id,
      cropId,
    },
  });
}
