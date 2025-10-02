import { Router } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";

const router = Router();

// Buscar todos os usuários
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Criar novo usuário
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.json(newUser);
});

// Editar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email },
  });

  res.json(updatedUser);
});

// Apagar usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({ where: { id: Number(id) } });

  res.json({ message: "Usuário apagado com sucesso!" });
});

export default router;
