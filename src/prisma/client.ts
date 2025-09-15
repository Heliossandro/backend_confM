import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function getUser() {
    const user = await prisma.user.findMany()
    console.log(user)
}

getUser()