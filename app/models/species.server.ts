import { prisma } from "~/db.server";

export function getSpeciesListItems() {
  return prisma.species.findMany();
}
