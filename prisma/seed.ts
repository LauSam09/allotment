import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CropStage } from "~/models/crops.server";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const garlicSpecies = await prisma.species.create({
    data: {
      name: "Garlic",
    },
  });

  const shallotSpecies = await prisma.species.create({
    data: {
      name: "Shallot",
    },
  });

  const earlyPotatoSpecies = await prisma.species.create({
    data: {
      name: "Potato (early)",
    },
  });

  const carrotSpecies = await prisma.species.create({
    data: {
      name: "Carrot",
      growingPeriodMin: 12,
      growingPeriodMax: 16,
    },
  });

  const beetrootSpecies = await prisma.species.create({
    data: {
      name: "Beetroot",
    },
  });

  const tomatoSpecies = await prisma.species.create({
    data: {
      name: "Tomato",
    },
  });

  const dwarfFrenchBeanSpecies = await prisma.species.create({
    data: {
      name: "Dwarf French Bean",
    },
  });

  const garlicCrop = await prisma.crop.create({
    data: {
      speciesId: garlicSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2021, 10, 16),
      cropId: garlicCrop.id,
    },
  });

  const shallotCrop = await prisma.crop.create({
    data: {
      speciesId: shallotSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2021, 11, 4),
      cropId: shallotCrop.id,
    },
  });

  const potatoCrop = await prisma.crop.create({
    data: {
      speciesId: earlyPotatoSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 2, 7),
      cropId: potatoCrop.id,
    },
  });

  const carrotCrop = await prisma.crop.create({
    data: {
      speciesId: carrotSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 2, 12),
      cropId: carrotCrop.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 3, 23),
      cropId: carrotCrop.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 4, 7),
      cropId: carrotCrop.id,
    },
  });

  const betrootCrop = await prisma.crop.create({
    data: {
      speciesId: beetrootSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 2, 12),
      cropId: betrootCrop.id,
    },
  });

  const tomatoCrop = await prisma.crop.create({
    data: {
      speciesId: tomatoSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 2, 20),
      cropId: tomatoCrop.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 3, 20),
      cropId: tomatoCrop.id,
    },
  });

  const dfbCrop = await prisma.crop.create({
    data: {
      speciesId: dwarfFrenchBeanSpecies.id,
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 2, 20),
      cropId: dfbCrop.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
