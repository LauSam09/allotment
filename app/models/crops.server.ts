import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getCropListItems({ userId }: { userId: User["id"] }) {
  return prisma.crop.findMany({
    where: { userId },
    select: { id: true, species: true },
  });
}
