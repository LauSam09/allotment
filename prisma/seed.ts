import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CropStage } from "~/models/crops.server";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

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

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const tomatoCrop = await prisma.crop.create({
    data: {
      species: "Tomato",
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 4, 8),
      cropId: tomatoCrop.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 4, 22),
      cropId: tomatoCrop.id,
    },
  });

  const dfbCrop = await prisma.crop.create({
    data: {
      species: "Dwarf French Bean",
      userId: user.id,
    },
  });

  await prisma.sowing.create({
    data: {
      stage: CropStage.Growing,
      plantedAt: new Date(2022, 4, 22),
      cropId: dfbCrop.id,
    },
  });

  await prisma.crop.create({
    data: {
      species: "Garlic",
      userId: user.id,
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
