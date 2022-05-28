import type { Crop, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Crop } from "@prisma/client";

export function getCrop({
  id,
  userId,
}: Pick<Crop, "id"> & { userId: User["id"] }) {
  return prisma.crop.findFirst({
    where: { id, userId },
  });
}

export function getCropListItems({ userId }: { userId: User["id"] }) {
  return prisma.crop.findMany({
    where: { userId },
    select: { id: true, species: true },
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
