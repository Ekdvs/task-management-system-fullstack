import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";

async function seed() {
  const email = "admin@test.com";
  const password = "123456";

  const existing = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
    },
  });

  console.log("Admin created");
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });