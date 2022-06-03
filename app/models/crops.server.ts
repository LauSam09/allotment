import type { Crop, Prisma, Sowing, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Crop } from "@prisma/client";

export type CropWithSowings = Prisma.CropGetPayload<{
  include: { sowings: true };
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
    include: { sowings: true },
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
  species,
  userId,
}: Pick<Crop, "species"> & { userId: User["id"] }) {
  return prisma.crop.create({
    data: {
      species,
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

export function createSowing({ id }: Pick<Crop, "id">) {
  return prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
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
