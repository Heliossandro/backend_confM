import { Router } from "express";
import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // hash da senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.json({ id: newUser.id, email: newUser.email });
});

export default router;
